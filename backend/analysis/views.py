from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from django.http import HttpResponse
from .models import Case, Analysis
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import io
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from django.conf import settings

def add_header_footer(canvas, doc):
    # Cabeçalho
    canvas.saveState()
    canvas.setFont('Helvetica-Bold', 10)
    canvas.drawString(cm, A4[1] - 1 * cm, "Perícia Grafotécnica – Laudo Técnico")

    # Rodapé
    canvas.setFont('Helvetica', 8)
    canvas.drawString(cm, 1 * cm, f"Página {doc.page}")
    canvas.restoreState()

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_case_report(request, case_id):
    try:
        case = Case.objects.get(pk=case_id, user=request.user)
        analyses = Analysis.objects.filter(case=case)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=A4,
                                rightMargin=2 * cm, leftMargin=2 * cm,
                                topMargin=2.5 * cm, bottomMargin=2.5 * cm)

        styles = getSampleStyleSheet()
        styles.add(ParagraphStyle(name='Justify', alignment=4, leading=16))
        story = []

        # Logotipo (opcional)
        logo_path = f"{settings.BASE_DIR}/static/logo.png"
        try:
            story.append(Image(logo_path, width=4 * cm, height=4 * cm))
        except:
            pass

        # Título
        story.append(Paragraph(f"Laudo Técnico – Caso #{case.id}", styles['Title']))
        story.append(Spacer(1, 12))
        story.append(Paragraph(f"<b>Descrição do Caso:</b> {case.description}", styles['Justify']))
        story.append(Spacer(1, 12))

        # Dados do perito
        story.append(Paragraph(f"<b>Perito:</b> {request.user.get_full_name()} ({request.user.email})", styles['Normal']))
        story.append(Spacer(1, 12))

        # Seção de análises
        story.append(Paragraph("Análises Realizadas:", styles['Heading2']))
        for idx, analysis in enumerate(analyses, 1):
            story.append(Paragraph(f"{idx}. {analysis.observation}", styles['Justify']))
            story.append(Spacer(1, 6))

        # Geração do PDF
        doc.build(story, onFirstPage=add_header_footer, onLaterPages=add_header_footer)

        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')

    except Case.DoesNotExist:
        return HttpResponse("Caso não encontrado", status=404)