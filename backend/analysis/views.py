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
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from django.shortcuts import get_object_or_404
import io
import os

from .models import Case, Analysis
from .serializers import AnalysisSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


def add_header_footer(canvas, doc):
    # ... permanece igual ...
    pass


def create_comparative_table(analysis, styles):
    # ... permanece igual ...
    pass


@api_view(['GET'])
@permission_classes([IsAuthenticated])
@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter('case_id', openapi.IN_PATH, description="ID do caso para gerar o relatório", type=openapi.TYPE_INTEGER),
    ],
    responses={200: 'PDF gerado com sucesso', 404: 'Caso não encontrado'}
)
def generate_case_report(request, case_id):
    """
    GET:
    Gera e retorna um relatório PDF com as análises do caso especificado,
    incluindo imagens comparativas e observações.
    """
    try:
        case = Case.objects.get(pk=case_id, user=request.user)
        analyses = Analysis.objects.filter(case=case)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4,
                                rightMargin=2 * cm, leftMargin=2 * cm,
                                topMargin=3 * cm, bottomMargin=2.5 * cm)

        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Justify', alignment=TA_JUSTIFY, leading=16))
        styles.add(ParagraphStyle(name='Center', alignment=TA_CENTER))

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
        story.append(Paragraph("Análises Realizadas:", styles['Heading2']))

        for idx, analysis in enumerate(analyses, 1):
            story.append(Spacer(1, 8))
            story.append(Paragraph(f"{idx}. {analysis.observation}", styles['Justify']))
            story.append(Spacer(1, 6))
            table = create_comparative_table(analysis, styles)
            story.append(table)

        story.append(PageBreak())
        story.append(Spacer(1, 48))
        story.append(Paragraph("_________________________________", styles['Center']))
        story.append(Paragraph("Assinatura do Perito", styles['Center']))
        story.append(Spacer(1, 24))
        story.append(Paragraph("Emitido por sistema de análise pericial", styles['Center']))

        doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)

        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')

    except Case.DoesNotExist:
        return HttpResponse("Caso não encontrado", status=404)


class AnalysisCreateView(generics.CreateAPIView):
    """
    post:
    Cria uma nova análise para o caso indicado na URL.
    Campos esperados: document_original, document_contested, observation.
    """
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_summary="Criar nova análise para um caso")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        case_id = self.kwargs.get('case_id')
        case = get_object_or_404(Case, pk=case_id, user=self.request.user)
        serializer.save(case=case)


class CaseAnalysisListView(generics.ListAPIView):
    """
    get:
    Lista todas as análises associadas a um caso específico.
    """
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(operation_summary="Listar análises de um caso")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        case_id = self.kwargs['case_id']
        return Analysis.objects.filter(case_id=case_id, case__user=self.request.user).order_by('-created_at')


class AnalysisUpdateView(generics.RetrieveUpdateAPIView):
    """
    get:
    Retorna os detalhes da análise para edição (usuário deve ser dono do caso).

    put/patch:
    Atualiza os dados da análise.
    """
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
