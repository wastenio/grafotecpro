from django.db import models
from django.conf import settings

class Case(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('in_progress', 'Em Andamento'),
        ('under_review', 'Em Revisão'),
        ('awaiting_validation', 'Aguardando Validação'),
        ('completed', 'Concluído'),
        ('rejected', 'Rejeitado'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cases')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    final_report = models.FileField(upload_to='laudos/', null=True, blank=True) 

    def __str__(self):
        return f"{self.title} ({self.get_status_display()})"

class Document(models.Model):
    case = models.ForeignKey(Case, related_name="documents", on_delete=models.CASCADE)
    file = models.FileField(upload_to="documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Document {self.id} - Case {self.case.id}"
