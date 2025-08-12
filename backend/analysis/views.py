from rest_framework import generics, permissions, status, viewsets, filters
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from cases.models import Document
from .models import Analysis, ForgeryType, Quesito, Case, Comparison, Pattern, DocumentVersion
from .serializers import (AnalysisSerializer, ComparisonDetailResultSerializer, ForgeryTypeSerializer, QuesitoSerializer,ComparisonSerializer, PatternSerializer,DocumentVersionSerializer)
from django.http import HttpResponse, FileResponse
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from django.conf import settings
import io
import os
import logging
from django.utils import timezone
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from analysis import utils
from .ml_service import calculate_signature_similarity
import openai
from .models import Comment
from .serializers import CommentSerializer

# Import para assinatura digital (opcional)
from .signing import sign_pdf_bytes_visible
from rest_framework import serializers

logger = logging.getLogger(__name__)

openai.api_key = os.getenv('OPENAI_API_KEY')

# --- Views para Quesito ---

class QuesitoListCreateView(generics.ListCreateAPIView):
    """
    Listar e criar quesitos associados a uma análise.
    """
    serializer_class = QuesitoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        analysis_id = self.kwargs['analysis_id']
        return Quesito.objects.filter(analysis_id=analysis_id, analysis__case__user=self.request.user)

    def perform_create(self, serializer):
        analysis_id = self.kwargs['analysis_id']
        analysis = get_object_or_404(Analysis, pk=analysis_id, case__user=self.request.user)
        serializer.save(analysis=analysis)


class QuesitoRetrieveUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    Recuperar, atualizar ou deletar um quesito específico.
    """
    serializer_class = QuesitoSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Quesito.objects.filter(analysis__case__user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(answered_by=self.request.user, answered_at=timezone.now())


# --- Views para Pattern ---

class PatternListCreateView(generics.ListCreateAPIView):
    """
    Listar e criar padrões de análise.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatternSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pattern.objects.all()
        return Pattern.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PatternDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Recuperar, atualizar ou deletar um padrão.
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PatternSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pattern.objects.all()
        return Pattern.objects.filter(owner=self.request.user)
    
# --- ViewSet para Analysis ---
class AnalysisViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gerenciar análises completas de grafotecnia.
    """
    serializer_class = AnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Analysis.objects.filter(
            case__user=self.request.user
        ).order_by('-created_at')

    def perform_create(self, serializer):
        case_id = self.request.data.get('case_id') or self.kwargs.get('case_id')
        case = get_object_or_404(Case, pk=case_id, user=self.request.user)
        serializer.save(case=case, perito=self.request.user)

    @action(detail=True, methods=['post'])
    def upload_document(self, request, pk=None):
        """
        Upload de documentos para a análise.
        """
        analysis = self.get_object()
        file = request.FILES.get('document')
        if not file:
            return Response({'error': 'Nenhum arquivo enviado.'}, status=status.HTTP_400_BAD_REQUEST)
        
        analysis.document = file
        analysis.save()
        return Response({'status': 'Documento anexado com sucesso.'})

    @action(detail=True, methods=['post'])
    def run_ai_analysis(self, request, pk=None):
        """
        Executa análise avançada via IA/comparação gráfica.
        """
        analysis = self.get_object()
        results = run_ai_graphic_analysis(analysis)
        analysis.ai_results = results
        analysis.save()
        return Response({'status': 'Análise de IA concluída.', 'results': results})

    @action(detail=False, methods=['get'])
    def forgery_types(self, request):
        """
        Lista os tipos de falsificações conhecidos.
        """
        return Response(utils.get_forgery_types())

    @action(detail=False, methods=['get'])
    def reference_patterns(self, request):
        """
        Lista padrões de referência para confronto gráfico.
        """
        return Response(utils.get_forgery_patterns())

    @action(detail=True, methods=['get'])
    def export_pdf(self, request, pk=None):
        """
        Exporta o laudo em PDF.
        """
        analysis = self.get_object()
        pdf_path = generate_pdf_report(analysis)
        with open(pdf_path, 'rb') as f:
            response = Response(f.read(), content_type='application/pdf')
            response['Content-Disposition'] = f'attachment; filename="laudo.pdf"'
            return response

    @action(detail=True, methods=['get'])
    def export_docx(self, request, pk=None):
        """
        Exporta o laudo em DOCX.
        """
        analysis = self.get_object()
        docx_path = generate_docx_report(analysis)
        with open(docx_path, 'rb') as f:
            response = Response(f.read(), content_type='application/vnd.openxmlformats-officedocument.wordprocessingml.document')
            response['Content-Disposition'] = f'attachment; filename="laudo.docx"'
            return response



# --- Views para Analysis ---

class AnalysisCreateView(generics.CreateAPIView):
    """
    Criar uma nova análise vinculada a um caso.
    """
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
    """
    Listar todas as análises de um caso específico.
    """
    serializer_class = AnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(operation_summary="Listar análises de um caso")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        case_id = self.kwargs['case_id']
        return Analysis.objects.filter(case_id=case_id, case__user=self.request.user).order_by('-created_at')


class AnalysisUpdateView(generics.RetrieveUpdateAPIView):
    """
    Recuperar ou atualizar uma análise específica.
    """
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


# --- Views para Comparison ---

class ComparisonListCreateView(generics.ListCreateAPIView):
    """
    Listar e criar comparações dentro de uma análise, com análise IA real integrada.
    """
    serializer_class = ComparisonSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        analysis_id = self.kwargs.get('analysis_id')
        return Comparison.objects.filter(analysis__id=analysis_id, analysis__case__user=self.request.user)

    def perform_create(self, serializer):
        analysis_id = self.kwargs.get('analysis_id')
        analysis = get_object_or_404(Analysis, pk=analysis_id, case__user=self.request.user)

        pattern = serializer.validated_data.get('pattern')
        document = serializer.validated_data.get('document')

        pattern_version = serializer.validated_data.get('pattern_version')
        document_version = serializer.validated_data.get('document_version')

        # Definir paths com versões, se fornecidas
        if pattern_version:
            path_img1 = pattern_version.file.path
        elif pattern and pattern.file:
            path_img1 = pattern.file.path
        else:
            path_img1 = None

        if document_version:
            path_img2 = document_version.file.path
        elif document and document.file:
            path_img2 = document.file.path
        else:
            path_img2 = None

        if not path_img1 or not path_img2:
            raise serializers.ValidationError("Arquivos válidos de pattern e document são necessários para comparação.")

        # 1. Chamada ML local para obter similaridade
        try:
            similarity_score = calculate_signature_similarity(path_img1, path_img2)
        except Exception:
            similarity_score = None  # Ou tratar erro

        # 2. Chamada OpenAI para gerar texto explicativo
        openai_prompt = f"""
    Você é um perito grafotécnico. Analise o seguinte resultado de similaridade de assinaturas:

    Similaridade numérica: {similarity_score if similarity_score is not None else 'não disponível'}.

    Explique o que isso pode indicar em termos de autenticidade, possível falsificação ou semelhança.
    """
        try:
            response = openai.Completion.create(
                model="text-davinci-003",
                prompt=openai_prompt,
                max_tokens=150,
                temperature=0.7
            )
            automatic_result = response.choices[0].text.strip()
        except Exception:
            automatic_result = "Não foi possível gerar a análise automática."

        serializer.save(
            analysis=analysis,
            similarity_score=similarity_score,
            automatic_result=automatic_result,
            pattern_version=pattern_version,
            document_version=document_version,
        )

class ComparisonDetailResultView(generics.RetrieveAPIView):
    queryset = Comparison.objects.all()
    serializer_class = ComparisonDetailResultSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'pk'


# --- Views para DocumentVersion ---

class DocumentVersionListCreateView(generics.ListCreateAPIView):
    """
    Listar e criar versões de documentos.
    """
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
        filename = version.file.name.split('/')[-1]
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
    except Exception as e:
        return Response({'detail': 'Erro ao acessar o arquivo.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- Funções auxiliares para relatório PDF ---

def add_header_footer(canvas, doc):
    """
    Adiciona marca d'água, cabeçalho e rodapé ao PDF.
    """
    canvas.saveState()

    canvas.setFont("Helvetica-Bold", 50)
    canvas.setFillColorRGB(0.8, 0.8, 0.8, alpha=0.15)
    canvas.translate(A4[0] / 2, A4[1] / 2)
    canvas.rotate(45)
    canvas.drawCentredString(0, 0, "CONFIDENCIAL")

    canvas.restoreState()

    # Cabeçalho
    canvas.setFont('Helvetica-Bold', 12)
    canvas.drawString(cm, A4[1] - 1 * cm, "Perícia Grafotécnica – Laudo Técnico")

    # Rodapé
    canvas.setFont('Helvetica', 9)
    canvas.drawRightString(A4[0] - cm, 1 * cm, f"Página {doc.page}")

    canvas.restoreState()


def create_comparative_table(analysis, styles):
    """
    Cria uma tabela com as imagens comparativas das assinaturas.
    """
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


# --- Geração de relatório PDF com assinatura opcional e tratamento de erros ---

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
    """
    Gera o laudo técnico em PDF, contendo análises, quesitos e assinatura visível.
    """
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

        # Quesitos e Respostas agrupados por análise
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

        # Assinatura digital (opcional)
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

class ForgeryTypeViewSet(viewsets.ModelViewSet):
    queryset = ForgeryType.objects.all()
    serializer_class = ForgeryTypeSerializer
    permission_classes = [permissions.IsAuthenticated]
    
class ForgeryTypeListCreateView(generics.ListCreateAPIView):
    """
    Listar e criar tipos de falsificação (biblioteca).
    """
    serializer_class = ForgeryTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ForgeryType.objects.all()
        return ForgeryType.objects.filter(owner=self.request.user)


class ForgeryTypeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Detalhes, atualização e remoção de um tipo de falsificação.
    """
    serializer_class = ForgeryTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ForgeryType.objects.all()
        return ForgeryType.objects.filter(owner=self.request.user)
    
class IsCaseMember(permissions.BasePermission):
    """
    Permite acesso somente para usuários relacionados ao case/perícia.
    Ajuste a lógica conforme regras de negócio.
    """

    def has_object_permission(self, request, view, obj):
        # Pode acessar se for usuário dono do case ou staff
        return (obj.case.user == request.user) or request.user.is_staff

    def has_permission(self, request, view):
        # Para list/create, vamos checar case_id na query params
        case_id = request.query_params.get('case')
        if case_id:
            from cases.models import Case
            try:
                case = Case.objects.get(pk=case_id)
                return (case.user == request.user) or request.user.is_staff
            except Case.DoesNotExist:
                return False
        return False


class CommentViewSet(viewsets.ModelViewSet):
    """
    CRUD completo para comentários.
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated, IsCaseMember]
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = ['created_at', 'updated_at']
    search_fields = ['text', 'user__username']

    def get_queryset(self):
        case_id = self.request.query_params.get('case')
        analysis_id = self.request.query_params.get('analysis')
        queryset = Comment.objects.all()

        if case_id:
            queryset = queryset.filter(case_id=case_id)
        if analysis_id:
            queryset = queryset.filter(analysis_id=analysis_id)
        # Caso queira só comentários raiz (sem parent), pode filtrar:
        root_only = self.request.query_params.get('root_only')
        if root_only in ['true', '1']:
            queryset = queryset.filter(parent__isnull=True)

        return queryset.order_by('created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)