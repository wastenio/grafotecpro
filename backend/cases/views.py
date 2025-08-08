from rest_framework import generics, permissions
from .models import Case, Document
from .serializers import CaseSerializer, CaseCreateSerializer, DocumentSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes


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
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        case_id = self.request.data.get('case')
        case = Case.objects.get(id=case_id, user=self.request.user)
        serializer.save(case=case)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_document_annotations(request, pk):
    try:
        document = Document.objects.get(pk=pk, case__user=request.user)
    except Document.DoesNotExist:
        return Response({'detail': 'Documento não encontrado'}, status=status.HTTP_404_NOT_FOUND)

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
        file = request.FILES.get('final_report')
        if file:
            case.final_report = file
            case.save()
            return Response({'message': 'Laudo enviado com sucesso.'})
        return Response({'error': 'Arquivo não enviado.'}, status=400)
    except Case.DoesNotExist:
        return Response({'error': 'Caso não encontrado.'}, status=404)
