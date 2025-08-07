from django.db import models
from django.conf import settings
from django.contrib.postgres.fields import JSONField  # se usar Postgres

class Case(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('in_progress', 'Em Andamento'),
        ('completed', 'Concluído'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cases')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

class Document(models.Model):
    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='documents')
    file = models.FileField(upload_to='documents/')
    description = models.CharField(max_length=255, blank=True, null=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    annotations = models.JSONField(blank=True, null=True)

    def __str__(self):
        return f"Documento do caso: {self.case.title}"
