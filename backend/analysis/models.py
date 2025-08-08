from django.db import models


class Case(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return self.title

class Document(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='documents/')
    description = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    annotations = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Documento do caso: {self.case.title}"

class Analysis(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='analyses')
    document_original = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='analyses_as_original')
    document_contested = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='analyses_as_contested')
    observation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Análise do caso {self.case.title} - {self.id}"