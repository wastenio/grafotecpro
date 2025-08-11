from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from .models import Case, Document
from .serializers import CaseSerializer, CaseCreateSerializer, DocumentSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.exceptions import NotFound


class CaseListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Case.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CaseCreateSerializer
        return CaseSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CaseDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Case.objects.filter(user=self.request.user)


class DocumentUploadView(generics.CreateAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    ALLOWED_CONTENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
    MAX_FILE_SIZE_MB = 10

    def perform_create(self, serializer):
        file = self.request.data.get('file')
        
        if not file:
            raise ValidationError("Arquivo não enviado.")
        
        # Validação do tipo MIME
        if file.content_type not in self.ALLOWED_CONTENT_TYPES:
            raise ValidationError("Tipo de arquivo não suportado. Aceitamos apenas PDF, JPG e PNG.")
        
        # Validação do tamanho (em bytes)
        max_size_bytes = self.MAX_FILE_SIZE_MB * 1024 * 1024
        if file.size > max_size_bytes:
            raise ValidationError(f"O arquivo excede o tamanho máximo permitido de {self.MAX_FILE_SIZE_MB}MB.")
        
        case_id = self.request.data.get('case')
        try:
            case = Case.objects.get(id=case_id, user=self.request.user)
        except Case.DoesNotExist:
            raise NotFound('Caso não encontrado ou não pertence ao usuário')
        serializer.save(case=case)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_document_annotations(request, pk):
    document = get_object_or_404(Document, pk=pk, case__user=request.user)

    annotations = request.data.get('annotations')
    if annotations is None:
        return Response({'detail': 'Annotations field required'}, status=status.HTTP_400_BAD_REQUEST)

    document.annotations = annotations
    document.save()
    return Response({'detail': 'Anotações atualizadas com sucesso'})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def upload_signed_report(request, case_id):
    try:
        case = Case.objects.get(pk=case_id, user=request.user)
    except Case.DoesNotExist:
        from rest_framework.exceptions import NotFound
        raise NotFound('Caso não encontrado ou sem permissão.')

    file = request.FILES.get('final_report')
    if not file:
        from rest_framework.exceptions import ValidationError
        raise ValidationError({'final_report': 'Arquivo final_report é obrigatório.'})

    case.final_report = file
    case.save()
    return Response({'message': 'Laudo enviado com sucesso.'})

