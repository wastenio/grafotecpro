from django.db import models
from cases.models import Case, Document

class Analysis(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='analyses')
    document_original = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='analyses_as_original')
    document_contested = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='analyses_as_contested')
    observation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Análise do caso {self.case.title} - {self.id}"
