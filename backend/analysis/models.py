from django.db import models
from django.conf import settings
from cases.models import Case, Document


class Pattern(models.Model):
    """
    Padrões de escrita/assinatura reutilizáveis.
    """
    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patterns')
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    uploaded_document = models.ForeignKey(Document, null=True, blank=True, on_delete=models.SET_NULL, related_name='as_pattern')
    metadata = models.JSONField(blank=True, null=True)
    tags = models.JSONField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} ({self.owner})"


class ForgeryType(models.Model):
    """
    Tipos de falsificação para catalogação e uso em comparações.
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name


class Quesito(models.Model):
    """
    Quesito vinculado a um Case.
    """
    case = models.ForeignKey(Case, related_name='quesitos', on_delete=models.CASCADE)
    requester = models.CharField(max_length=255, blank=True)  # quem solicitou
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # resposta (preenchida pelo perito)
    answered_text = models.TextField(blank=True, null=True)
    answered_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    answered_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Quesito #{self.pk} - Case {self.case.id}"


class Analysis(models.Model):
    """
    Análise principal (ampliação do modelo anterior).
    """
    STATUS_CHOICES = [
        ('pending', 'Pendente'),
        ('in_progress', 'Em análise'),
        ('completed', 'Concluída'),
        ('reviewed', 'Revisada'),
    ]

    case = models.ForeignKey(Case, on_delete=models.CASCADE, related_name='analyses')
    document_original = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='analyses_as_original', null=True, blank=True)
    document_contested = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='analyses_as_contested', null=True, blank=True)
    observation = models.TextField(blank=True)
    methodology = models.TextField(blank=True)
    conclusion = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    perito = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    automatic_result = models.TextField(blank=True, null=True)  # resultado de análise automática AI ou comparação

    def __str__(self):
        return f"Análise {self.pk} - Caso {self.case.id}"


class Comparison(models.Model):
    """
    Resultado do confronto entre um Pattern e um Document (questionado).
    """
    analysis = models.ForeignKey(Analysis, related_name='comparisons', on_delete=models.CASCADE)
    pattern = models.ForeignKey(Pattern, null=True, blank=True, on_delete=models.SET_NULL, related_name='comparisons')
    document = models.ForeignKey(Document, null=True, blank=True, on_delete=models.SET_NULL, related_name='comparisons')
    similarity_score = models.FloatField(null=True, blank=True)
    findings = models.TextField(blank=True)  # observações detalhadas
    forgery_type = models.ForeignKey(ForgeryType, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comparison {self.pk} - Analysis {self.analysis.pk}"


class DocumentVersion(models.Model):
    """
    Versões do documento (history).
    """
    document = models.ForeignKey(Document, related_name='versions', on_delete=models.CASCADE)
    file = models.FileField(upload_to='documents/versions/')
    version_number = models.PositiveIntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    changelog = models.TextField(blank=True)

    class Meta:
        unique_together = ('document', 'version_number')
        ordering = ['-version_number']

    def __str__(self):
        return f"{self.document} - v{self.version_number}"
