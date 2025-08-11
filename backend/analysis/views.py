from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image, Table, TableStyle
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_JUSTIFY, TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from django.http import HttpResponse
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import generics, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.utils import timezone
import io
import os

import tempfile
from .signing import sign_pdf_bytes

from .models import Pattern, Quesito, Analysis, Comparison, DocumentVersion
from .serializers import (
    PatternSerializer,
    QuesitoSerializer,
    AnalysisSerializer,
    ComparisonSerializer,
    DocumentVersionSerializer
)
from cases.models import Case, Document
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


# ============================================================
# Geração de PDF - Relatório do Caso
# ============================================================
def add_header_footer(canvas, doc):
    # ... permanece igual ...
    pass


def create_comparative_table(analysis, styles):
    # ... permanece igual ...
    pass


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@swagger_auto_schema(
    manual_parameters=[
        openapi.Parameter(
            'case_id', openapi.IN_PATH,
            description="ID do caso para gerar o relatório",
            type=openapi.TYPE_INTEGER
        ),
    ],
    responses={200: 'PDF gerado com sucesso', 404: 'Caso não encontrado'}
)
def generate_case_report(request, case_id):
    case = get_object_or_404(Case, pk=case_id, user=request.user)
    analyses = Analysis.objects.filter(case=case)

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=2 * cm, leftMargin=2 * cm,
        topMargin=3 * cm, bottomMargin=2.5 * cm
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY, leading=16))
    styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))

    story = []

    # Logo
    logo_path = os.path.join(settings.BASE_DIR, "static", "logo.png")
    if os.path.exists(logo_path):
        story.append(Image(logo_path, width=4 * cm, height=4 * cm))
        story.append(Spacer(1, 12))

    # Título e descrição
    story.append(Paragraph(f"Laudo Técnico – Caso #{case.id}", styles['Title']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"<b>Descrição do Caso:</b> {case.description}", styles['Justify']))
    story.append(Spacer(1, 12))
    story.append(Paragraph(f"<b>Perito:</b> {request.user.get_full_name()} ({request.user.email})", styles['Normal']))
    story.append(Spacer(1, 12))

    # Quesitos e Respostas
    story.append(Paragraph("Quesitos e Respostas:", styles['Heading2']))
    for q in case.quesitos.all():
        story.append(Paragraph(f"Q{q.pk}: {q.text}", styles['Normal']))
        if q.answered_text:
            story.append(Paragraph(f"Resposta: {q.answered_text}", styles['Normal']))
        else:
            story.append(Paragraph("Resposta: (não respondido)", styles['Normal']))
        story.append(Spacer(1, 6))

    story.append(Spacer(1, 12))

    # Análises
    story.append(Paragraph("Análises Realizadas:", styles['Heading2']))
    for idx, analysis in enumerate(analyses, 1):
        story.append(Spacer(1, 8))
        story.append(Paragraph(f"{idx}. {analysis.observation}", styles['Justify']))
        story.append(Spacer(1, 6))
        table = create_comparative_table(analysis, styles)
        story.append(table)

    # Assinatura
    story.append(PageBreak())
    story.append(Spacer(1, 48))
    story.append(Paragraph("_________________________________", styles['Center']))
    story.append(Paragraph("Assinatura do Perito", styles['Center']))
    story.append(Spacer(1, 24))
    story.append(Paragraph("Emitido por sistema de análise pericial", styles['Center']))

    # Build PDF
    try:
        doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)
    except Exception as e:
        return Response({'error': f'Erro ao gerar PDF: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    buffer.seek(0)
    unsigned_pdf_bytes = buffer.getvalue()

    # Configuração de assinatura
    pfx_path = os.getenv('SIGNER_PFX_PATH') or getattr(settings, 'SIGNER_PFX_PATH', None)
    pfx_password = os.getenv('SIGNER_PFX_PASSWORD') or getattr(settings, 'SIGNER_PFX_PASSWORD', None)
    tsa_url = os.getenv('TSA_URL') or getattr(settings, 'TSA_URL', None)
    tsa_cert = os.getenv('TSA_CERT_PATH') or getattr(settings, 'TSA_CERT_PATH', None)

    if pfx_path and pfx_password:
        try:
            signed_bytes = sign_pdf_bytes(
                unsigned_pdf_bytes,
                pfx_path=pfx_path,
                pfx_password=pfx_password,
                tsa_url=tsa_url or None,
                tsa_cert_path=tsa_cert or None
            )
            response_bytes = signed_bytes
            filename = f'laudo_caso_{case.id}_signed.pdf'
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error("Erro ao assinar PDF: %s", e, exc_info=True)
            response_bytes = unsigned_pdf_bytes
            filename = f'laudo_caso_{case.id}.pdf'
    else:
        response_bytes = unsigned_pdf_bytes
        filename = f'laudo_caso_{case.id}.pdf'

    # Retorna como download
    resp = HttpResponse(response_bytes, content_type='application/pdf')
    resp['Content-Disposition'] = f'attachment; filename="{filename}"'
    return resp




# ============================================================
# Patterns
# ============================================================
class PatternListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PatternSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pattern.objects.all()
        return Pattern.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class PatternDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PatternSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Pattern.objects.all()
        return Pattern.objects.filter(owner=self.request.user)


# ============================================================
# Quesitos
# ============================================================
class QuesitoListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuesitoSerializer

    def get_queryset(self):
        case_id = self.kwargs.get('case_id')
        return Quesito.objects.filter(case__id=case_id, case__user=self.request.user)

    def perform_create(self, serializer):
        case_id = self.kwargs.get('case_id')
        case = get_object_or_404(Case, pk=case_id, user=self.request.user)
        serializer.save(case=case)


class QuesitoAnswerView(generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = QuesitoSerializer
    lookup_field = 'pk'

    def get_queryset(self):
        if self.request.user.is_staff:
            return Quesito.objects.all()
        return Quesito.objects.filter(case__user=self.request.user)

    def perform_update(self, serializer):
        serializer.save(answered_by=self.request.user, answered_at=timezone.now())


# ============================================================
# Analyses
# ============================================================
class AnalysisCreateView(generics.CreateAPIView):
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_summary="Criar nova análise para um caso")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        case_id = self.kwargs.get('case_id')
        case = get_object_or_404(Case, pk=case_id, user=self.request.user)
        serializer.save(case=case, perito=self.request.user)


class CaseAnalysisListView(generics.ListAPIView):
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_summary="Listar análises de um caso")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        case_id = self.kwargs['case_id']
        return Analysis.objects.filter(case_id=case_id, case__user=self.request.user).order_by('-created_at')


class AnalysisUpdateView(generics.RetrieveUpdateAPIView):
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]

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


# ============================================================
# Comparisons
# ============================================================
class ComparisonListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ComparisonSerializer

    def get_queryset(self):
        analysis_id = self.kwargs.get('analysis_id')
        return Comparison.objects.filter(
            analysis__id=analysis_id,
            analysis__case__user=self.request.user
        )

    def perform_create(self, serializer):
        analysis_id = self.kwargs.get('analysis_id')
        analysis = get_object_or_404(Analysis, pk=analysis_id, case__user=self.request.user)
        serializer.save(analysis=analysis)


# ============================================================
# Document Versions
# ============================================================
class DocumentVersionListCreateView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DocumentVersionSerializer

    def get_queryset(self):
        document_id = self.kwargs.get('document_id')
        return DocumentVersion.objects.filter(
            document__id=document_id,
            document__case__user=self.request.user
        ).order_by('-version_number')

    def perform_create(self, serializer):
        document_id = self.kwargs.get('document_id')
        document = get_object_or_404(Document, pk=document_id, case__user=self.request.user)
        last = DocumentVersion.objects.filter(document=document).order_by('-version_number').first()
        next_version = 1 if not last else last.version_number + 1
        serializer.save(document=document, uploaded_by=self.request.user, version_number=next_version)
