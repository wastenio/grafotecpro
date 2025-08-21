# 1. Bibliotecas padrão
import os
import io
import logging
import openai
from django.utils import timezone

# 2. Django
from django.conf import settings
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, FileResponse

# 3. DRF e terceiros
from rest_framework import (
    generics, permissions, status, viewsets, serializers
)
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework import filters as drf_filters
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# ReportLab
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors

# 4. Projeto interno
from cases.models import Document, Case
from .models import (
    Analysis, ForgeryType, Quesito, Comparison,
    Pattern, DocumentVersion, Comment
)
from .serializers import (
    AnalysisCreateUpdateSerializer, AnalysisListSerializer, AnalysisSerializer,
    ComparisonCreateUpdateSerializer, ComparisonDetailResultSerializer,
    ComparisonListSerializer, ForgeryTypeSerializer, QuesitoSerializer,
    ComparisonSerializer, PatternSerializer, DocumentVersionSerializer,
    CommentSerializer
)
from .permissions import IsCasePeritoOrReadOnly, IsCommentAuthorOrReadOnly
from .filters import AnalysisFilter
from .ml_service import calculate_signature_similarity
from .comparison_service import analyze_signature
from .signing import sign_pdf_bytes_visible
from analysis import utils


logger = logging.getLogger(__name__)
openai.api_key = os.getenv('OPENAI_API_KEY')


# --- Quesito Views ---
class QuesitoListCreateView(generics.ListCreateAPIView):
    serializer_class = QuesitoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        analysis_id = self.kwargs['analysis_id']
        user = self.request.user
        if user.is_staff:
            return Quesito.objects.filter(analysis_id=analysis_id)
        return Quesito.objects.filter(analysis_id=analysis_id, analysis__case__user=user)

    def perform_create(self, serializer):
        analysis_id = self.kwargs['analysis_id']
        analysis = get_object_or_404(Analysis, pk=analysis_id, case__user=self.request.user)
        serializer.save(analysis=analysis)


class QuesitoRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = QuesitoSerializer
    permission_classes = [permissions.IsAuthenticated, IsCasePeritoOrReadOnly]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Quesito.objects.all()
        return Quesito.objects.filter(case__perito=user)

    def perform_update(self, serializer):
        serializer.save(answered_by=self.request.user, answered_at=timezone.now())


# --- Pattern Views ---
class PatternListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatternSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pattern.objects.all()
        return Pattern.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PatternDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatternSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pattern.objects.all()
        return Pattern.objects.filter(owner=self.request.user)


# --- Pagination ---
class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


# --- Analysis ViewSet ---
class AnalysisViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [DjangoFilterBackend, drf_filters.OrderingFilter, drf_filters.SearchFilter]
    filterset_class = AnalysisFilter
    search_fields = ['observation', 'methodology', 'conclusion']
    ordering_fields = ['created_at', 'status', 'perito__username']
    ordering = ['-created_at']
    pagination_class = StandardResultsSetPagination
    queryset = Analysis.objects.all()

    def get_queryset(self):
        return Analysis.objects.filter(case__user=self.request.user).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return AnalysisListSerializer
        return AnalysisCreateUpdateSerializer


    def perform_create(self, serializer):
        case_id = self.request.data.get('case_id') or self.kwargs.get('case_id')
        case = get_object_or_404(Case, pk=case_id, user=self.request.user)
        serializer.save(case=case, perito=self.request.user)

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        analysis = self.get_object()
        file = request.FILES.get('document')
        if not file:
            return Response({'error': 'Nenhum arquivo enviado.'}, status=status.HTTP_400_BAD_REQUEST)
        analysis.document = file
        analysis.save()
        return Response({'status': 'Documento anexado com sucesso.'})

    @action(detail=True, methods=['post'])
    def run_ai_analysis(self, request, pk=None):
        analysis = self.get_object()
        results = run_ai_graphic_analysis(analysis)
        analysis.ai_results = results
        analysis.save()
        return Response({'status': 'Análise de IA concluída.', 'results': results})

    @action(detail=False, methods=['get'])
    def forgery_types(self, request):
        return Response(utils.get_forgery_types())

    @action(detail=False, methods=['get'])
    def reference_patterns(self, request):
        return Response(utils.get_forgery_patterns())

    @action(detail=True, methods=['get'])
    def export_pdf(self, request, pk=None):
        analysis = self.get_object()
        case = analysis.case

        pdf_path = generate_pdf(case, include_signature=True)
        if not pdf_path:
            return Response({"error": "Falha ao gerar PDF"}, status=500)

        with open(pdf_path, "rb") as f:
            response = HttpResponse(f.read(), content_type="application/pdf")
            response['Content-Disposition'] = f'attachment; filename="case_{case.id}_report.pdf"'
            return response

    @action(detail=True, methods=['get'])
    def export_docx(self, request, pk=None):
        analysis = self.get_object()
        case = analysis.case

        docx_path = generate_docx(case, include_signature=True)
        if not docx_path:
            return Response({"error": "Falha ao gerar DOCX"}, status=500)

        with open(docx_path, "rb") as f:
            response = HttpResponse(f.read(), content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document")
            response['Content-Disposition'] = f'attachment; filename="case_{case.id}_report.docx"'
            return response


# --- Analysis Create/View ---
class AnalysisCreateView(generics.CreateAPIView):
    serializer_class = AnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(operation_summary="Criar nova análise para um caso")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        case_id = self.kwargs.get('case_id')
        case = get_object_or_404(Case, pk=case_id, user=self.request.user)
        serializer.save(case=case, perito=self.request.user)


class CaseAnalysisListView(generics.ListAPIView):
    serializer_class = AnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(operation_summary="Listar análises de um caso")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        case_id = self.kwargs.get('case_id')  # pega o case_id da URL
        # Filtra análises que pertencem ao caso e ao usuário autenticado
        return Analysis.objects.filter(case_id=case_id, case__user=self.request.user)


class AnalysisUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = AnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(operation_summary="Visualizar/editar análise")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Atualizar análise")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Atualizar parcialmente análise")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    def get_queryset(self):
        return Analysis.objects.filter(case__user=self.request.user)


# --- Comparison Views ---
class ComparisonListCreateView(generics.ListCreateAPIView):
    """
    View para listar e criar Comparisons vinculados a uma Analysis.
    """
    serializer_class = ComparisonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        analysis_id = self.kwargs.get('analysis_id')
        user = self.request.user
        if user.is_staff:
            return Comparison.objects.filter(analysis__id=analysis_id)
        return Comparison.objects.filter(analysis__id=analysis_id, analysis__case__user=user)

    def perform_create(self, serializer):
        analysis_id = self.kwargs.get('analysis_id')
        analysis = get_object_or_404(Analysis, pk=analysis_id, case__user=self.request.user)

        # Determina os caminhos das imagens
        pattern = serializer.validated_data.get('pattern')
        document = serializer.validated_data.get('document')
        pattern_version = serializer.validated_data.get('pattern_version')
        document_version = serializer.validated_data.get('document_version')

        if pattern_version:
            path_img1 = pattern_version.file.path
        elif pattern and hasattr(pattern, 'file') and pattern.file:
            path_img1 = pattern.file.path
        else:
            path_img1 = None

        if document_version:
            path_img2 = document_version.file.path
        elif document and hasattr(document, 'file') and document.file:
            path_img2 = document.file.path
        else:
            path_img2 = None

        if not path_img1 or not path_img2:
            raise serializers.ValidationError("Arquivos válidos de pattern e document são necessários para a comparação.")

        # Lógica refatorada: chama o serviço para obter os resultados
        result_data = analyze_signature(path_img1, path_img2)

        # Salva o objeto Comparison com os dados obtidos do serviço
        serializer.save(
            analysis=analysis,
            similarity_score=result_data['similarity_score'],
            automatic_result=result_data['automatic_result'],
            pattern_version=pattern_version,
            document_version=document_version,
        )


from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Comparison
from .serializers import ComparisonSerializer, ComparisonCreateUpdateSerializer


class ComparisonViewSet(viewsets.ModelViewSet):
    """
    ViewSet completo para Comparisons, usando serializers diferentes para leitura e escrita.
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = Comparison.objects.all()

    def get_serializer_class(self):
        if self.action in ["list", "retrieve"]:
            return ComparisonListSerializer
        return ComparisonCreateUpdateSerializer

    def get_queryset(self):
        user = self.request.user
        # Filtra Comparisons para garantir que usuário só veja seus próprios casos
        return Comparison.objects.filter(analysis__case__user=user)

    def create(self, request, *args, **kwargs):
        """
        Criação de uma Comparison vinculando versões de documentos
        (pattern_version e document_version) em vez de apenas documentos.
        """
        pattern_version_id = request.data.get("pattern_version_id")
        document_version_id = request.data.get("document_version_id")

        if not (pattern_version_id and document_version_id):
            return Response(
                {"error": "Ambas as versões (padrão e documento) devem ser fornecidas."},
                status=status.HTTP_400_BAD_REQUEST
            )

        comparison = Comparison.objects.create(
            analysis_id=request.data.get("analysis"),
            pattern_version_id=pattern_version_id,
            document_version_id=document_version_id,
            findings=request.data.get("findings", ""),
            similarity_score=request.data.get("similarity_score"),
            automatic_result=request.data.get("automatic_result")
        )

        serializer = self.get_serializer(comparison)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



class ComparisonDetailResultView(generics.RetrieveAPIView):
    """
    View para obter detalhes do resultado da comparação.
    """
    queryset = Comparison.objects.all()
    serializer_class = ComparisonDetailResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'

    def get_queryset(self):
        # Restringe acesso apenas para comparações dos casos do usuário
        user = self.request.user
        return Comparison.objects.filter(analysis__case__user=user)


# --- DocumentVersion Views ---
class DocumentVersionListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = DocumentVersionSerializer

    def get_queryset(self):
        document_id = self.kwargs['document_id']
        return DocumentVersion.objects.filter(
            document_id=document_id,
            document__case__user=self.request.user
        ).order_by('-version_number')

    def perform_create(self, serializer):
        document_id = self.kwargs['document_id']
        document = get_object_or_404(Document, pk=document_id, case__user=self.request.user)

        last_version = DocumentVersion.objects.filter(document=document).order_by('-version_number').first()
        next_version = 1 if not last_version else last_version.version_number + 1

        serializer.save(
            document=document,
            uploaded_by=self.request.user,
            version_number=next_version
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_document_version(request, version_id):
    version = get_object_or_404(DocumentVersion, pk=version_id, document__case__user=request.user)
    try:
        response = FileResponse(version.file.open('rb'), content_type='application/octet-stream')
        filename = os.path.basename(version.file.name)
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    except Exception as e:
        logger.error(f"Erro ao acessar arquivo: {e}", exc_info=True)
        return Response({'detail': 'Erro ao acessar o arquivo.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- PDF Report Helpers ---
def add_header_footer(canvas, doc):
    canvas.saveState()
    canvas.setFont("Helvetica-Bold", 50)
    canvas.setFillColorRGB(0.8, 0.8, 0.8, alpha=0.15)
    canvas.translate(A4[0] / 2, A4[1] / 2)
    canvas.rotate(45)
    canvas.drawCentredString(0, 0, "CONFIDENCIAL")
    canvas.restoreState()

    # Header
    canvas.setFont('Helvetica-Bold', 12)
    canvas.drawString(cm, A4[1] - 1 * cm, "Perícia Grafotécnica – Laudo Técnico")

    # Footer
    canvas.setFont('Helvetica', 9)
    canvas.drawRightString(A4[0] - cm, 1 * cm, f"Página {doc.page}")

    canvas.restoreState()


def create_comparative_table(analysis, styles):
    imgs = []
    if analysis.document_contested and analysis.document_contested.file:
        imgs.append(Image(analysis.document_contested.file.path, width=7*cm, height=3*cm))
    else:
        imgs.append(Paragraph("Sem imagem questionada", styles['Normal']))

    if analysis.document_original and analysis.document_original.file:
        imgs.append(Image(analysis.document_original.file.path, width=7*cm, height=3*cm))
    else:
        imgs.append(Paragraph("Sem imagem padrão", styles['Normal']))

    data = [
        imgs,
        [
            Paragraph("Assinatura Questionada", styles['Center']),
            Paragraph("Assinatura Padrão", styles['Center'])
        ]
    ]

    table = Table(data, colWidths=[8*cm, 8*cm])
    table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOX', (0,0), (-1,0), 1, colors.black),
        ('BOTTOMPADDING', (0,0), (-1,0), 10)
    ]))
    return table


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@swagger_auto_schema(
    manual_parameters=[
        openapi.Parameter(
            'case_id', openapi.IN_PATH,
            description="ID do caso para gerar o relatório",
            type=openapi.TYPE_INTEGER
        ),
    ],
    responses={
        200: 'PDF gerado com sucesso',
        404: 'Caso não encontrado',
        500: 'Erro interno'
    }
)
def generate_case_report(request, case_id):
    try:
        case = get_object_or_404(Case, pk=case_id, user=request.user)
        analyses = Analysis.objects.filter(case=case)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4,
                                rightMargin=2 * cm, leftMargin=2 * cm,
                                topMargin=3 * cm, bottomMargin=2.5 * cm)

        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY, leading=16))
        styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))
        styles.add(ParagraphStyle(name='Italic', fontName='Helvetica-Oblique'))

        story = []

        logo_path = os.path.join(settings.BASE_DIR, "static", "logo.png")
        if os.path.exists(logo_path):
            story.append(Image(logo_path, width=4 * cm, height=4 * cm))
            story.append(Spacer(1, 12))

        story.append(Paragraph(f"Laudo Técnico – Caso #{case.id}", styles['Title']))
        story.append(Spacer(1, 12))
        story.append(Paragraph(f"<b>Descrição do Caso:</b> {case.description}", styles['Justify']))
        story.append(Spacer(1, 12))
        story.append(Paragraph(f"<b>Perito:</b> {request.user.get_full_name()} ({request.user.email})", styles['Normal']))
        story.append(Spacer(1, 12))

        for idx, analysis in enumerate(analyses, 1):
            story.append(Spacer(1, 8))
            story.append(Paragraph(f"{idx}. {analysis.observation}", styles['Justify']))
            story.append(Spacer(1, 6))

            table = create_comparative_table(analysis, styles)
            story.append(table)

            quesitos = analysis.quesitos.all()
            if quesitos.exists():
                story.append(Spacer(1, 8))
                story.append(Paragraph("Quesitos e Respostas:", styles['Heading3']))
                for q in quesitos:
                    story.append(Paragraph(f"<b>Q:</b> {q.text}", styles['Normal']))
                    if q.answered_text:
                        story.append(Paragraph(f"<b>R:</b> {q.answered_text}", styles['Justify']))
                    else:
                        story.append(Paragraph("<i>Resposta não fornecida</i>", styles['Italic']))
                    story.append(Spacer(1, 6))

        story.append(PageBreak())
        story.append(Spacer(1, 48))
        story.append(Paragraph("_________________________________", styles['Center']))
        story.append(Paragraph("Assinatura do Perito", styles['Center']))
        story.append(Spacer(1, 24))
        story.append(Paragraph("Emitido por sistema de análise pericial", styles['Center']))

        doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)

        buffer.seek(0)
        unsign_pdf_bytes_visible = buffer.getvalue()

        pfx_path = os.getenv('SIGNER_PFX_PATH') or getattr(settings, 'SIGNER_PFX_PATH', None)
        pfx_password = os.getenv('SIGNER_PFX_PASSWORD') or getattr(settings, 'SIGNER_PFX_PASSWORD', None)
        tsa_url = os.getenv('TSA_URL') or getattr(settings, 'TSA_URL', None)
        tsa_cert = os.getenv('TSA_CERT_PATH') or getattr(settings, 'TSA_CERT_PATH', None)

        if pfx_path and pfx_password:
            try:
                signed_bytes = sign_pdf_bytes_visible(
                    unsign_pdf_bytes_visible,
                    pfx_path=pfx_path,
                    pfx_password=pfx_password,
                    tsa_url=tsa_url or None,
                    tsa_cert_path=tsa_cert or None
                )
                response_bytes = signed_bytes
                filename = f'laudo_caso_{case.id}_signed.pdf'
            except Exception as e:
                logger.error("Erro ao assinar PDF: %s", e, exc_info=True)
                response_bytes = unsign_pdf_bytes_visible
                filename = f'laudo_caso_{case.id}.pdf'
        else:
            response_bytes = unsign_pdf_bytes_visible
            filename = f'laudo_caso_{case.id}.pdf'

        resp = HttpResponse(response_bytes, content_type='application/pdf')
        resp['Content-Disposition'] = f'attachment; filename="{filename}"'
        return resp

    except Case.DoesNotExist:
        return Response({"detail": "Caso não encontrado"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error("Erro ao gerar PDF: %s", e, exc_info=True)
        return Response({"detail": f"Erro interno ao gerar PDF: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# --- ForgeryType Views ---
class ForgeryTypeViewSet(viewsets.ModelViewSet):
    queryset = ForgeryType.objects.all()
    serializer_class = ForgeryTypeSerializer
    permission_classes = [permissions.IsAuthenticated]


class ForgeryTypeListCreateView(generics.ListCreateAPIView):
    serializer_class = ForgeryTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ForgeryType.objects.all()
        return ForgeryType.objects.filter(owner=self.request.user)


class ForgeryTypeDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ForgeryTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ForgeryType.objects.all()
        return ForgeryType.objects.filter(owner=self.request.user)





# --- Comment Views ---
class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCommentAuthorOrReadOnly]
    filter_backends = [OrderingFilter, SearchFilter]
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['text', 'author__username']

    def get_queryset(self):
        user = self.request.user
        queryset = Comment.objects.filter(case__user=user)

        case_id = self.request.query_params.get('case')
        analysis_id = self.request.query_params.get('analysis')
        if case_id:
            queryset = queryset.filter(case_id=case_id)
        if analysis_id:
            queryset = queryset.filter(analysis_id=analysis_id)

        root_only = self.request.query_params.get('root_only')
        if root_only in ['true', '1']:
            queryset = queryset.filter(parent__isnull=True)

        return queryset.order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
