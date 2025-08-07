from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from django.http import HttpResponse
from .models import Case, Analysis
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
import io

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_case_report(request, case_id):
    try:
        case = Case.objects.get(pk=case_id, user=request.user)
        analyses = Analysis.objects.filter(case=case)

        buffer = io.BytesIO()
        doc = SimpleDocTemplate(buffer)
        styles = getSampleStyleSheet()
        story = []

        # Cabeçalho
        story.append(Paragraph(f"Laudo Técnico – Caso #{case.id}", styles['Title']))
        story.append(Spacer(1, 12))
        story.append(Paragraph(f"Descrição do Caso: {case.description}", styles['Normal']))
        story.append(Spacer(1, 12))

        # Análises
        story.append(Paragraph("Análises realizadas:", styles['Heading2']))
        for idx, analysis in enumerate(analyses, start=1):
            story.append(Spacer(1, 6))
            story.append(Paragraph(f"{idx}. {analysis.observation}", styles['Normal']))

        doc.build(story)

        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')
    
    except Case.DoesNotExist:
        return HttpResponse("Caso não encontrado", status=404)
