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
import io
import os

from .models import Case, Analysis
from .serializers import AnalysisSerializer


def add_header_footer(canvas, doc):
    canvas.saveState()

    # Marca d'água CONFIDENCIAL
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
    """ Cria uma tabela com as imagens lado a lado e legendas. """
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
@permission_classes([IsAuthenticated])
def generate_case_report(request, case_id):
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

        # Logo (opcional)
        logo_path = os.path.join(settings.BASE_DIR, "static", "logo.png")
        if os.path.exists(logo_path):
            story.append(Image(logo_path, width=4 * cm, height=4 * cm))
            story.append(Spacer(1, 12))

        # Título e descrição
        story.append(Paragraph(f"Laudo Técnico – Caso #{case.id}", styles['Title']))
        story.append(Spacer(1, 12))
        story.append(Paragraph(f"<b>Descrição do Caso:</b> {case.description}", styles['Justify']))
        story.append(Spacer(1, 12))

        # Dados do perito
        story.append(Paragraph(f"<b>Perito:</b> {request.user.get_full_name()} ({request.user.email})", styles['Normal']))
        story.append(Spacer(1, 12))

        # Análises com imagens comparativas
        story.append(Paragraph("Análises Realizadas:", styles['Heading2']))
        for idx, analysis in enumerate(analyses, 1):
            story.append(Spacer(1, 8))
            story.append(Paragraph(f"{idx}. {analysis.observation}", styles['Justify']))
            story.append(Spacer(1, 6))
            # Adiciona tabela comparativa se imagens existirem
            table = create_comparative_table(analysis, styles)
            story.append(table)

        # Assinatura final
        story.append(PageBreak())
        story.append(Spacer(1, 48))
        story.append(Paragraph("_________________________________", styles['Center']))
        story.append(Paragraph("Assinatura do Perito", styles['Center']))
        story.append(Spacer(1, 24))
        story.append(Paragraph("Emitido por sistema de análise pericial", styles['Center']))

        # Gera o PDF com cabeçalho, rodapé e marca d’água
        doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)

        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')

    except Case.DoesNotExist:
        return HttpResponse("Caso não encontrado", status=404)


class AnalysisCreateView(generics.CreateAPIView):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]


class CaseAnalysisListView(generics.ListAPIView):
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        case_id = self.kwargs['case_id']
        return Analysis.objects.filter(case_id=case_id).order_by('-created_at')


class AnalysisUpdateView(generics.RetrieveUpdateAPIView):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]


class AnalysisDeleteView(generics.DestroyAPIView):
    queryset = Analysis.objects.all()
    serializer_class = AnalysisSerializer
    permission_classes = [IsAuthenticated]
