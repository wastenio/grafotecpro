from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Document
from analysis.models import DocumentVersion  # precisa importar aqui
from django.conf import settings

@receiver(post_save, sender=Document)
def create_document_version(sender, instance, created, **kwargs):
    if created:
        # Cria versão inicial
        DocumentVersion.objects.create(
            document=instance,
            file=instance.file,
            version_number=1,
            uploaded_by=instance.uploaded_by,
            changelog="Versão inicial automática"
        )
    else:
        # Se o arquivo foi atualizado → cria nova versão
        latest_version = instance.versions.first()  # ordering já está -version_number
        next_version = (latest_version.version_number + 1) if latest_version else 1

        DocumentVersion.objects.create(
            document=instance,
            file=instance.file,
            version_number=next_version,
            uploaded_by=instance.uploaded_by,
            changelog="Atualização automática"
        )
