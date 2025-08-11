from rest_framework import generics, permissions
from .models import Case, Document
from .serializers import CaseSerializer, CaseCreateSerializer, DocumentSerializer
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from django.shortcuts import get_object_or_404
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


class CaseListCreateView(generics.ListCreateAPIView):
    """
    get:
    Retorna a lista de casos associados ao usuário autenticado.

    post:
    Cria um novo caso para o usuário autenticado.
    Campos esperados: title (string), description (string opcional), status (string opcional).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Case.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CaseCreateSerializer
        return CaseSerializer

    @swagger_auto_schema(operation_summary="Listar casos do usuário autenticado")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Criar novo caso")
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CaseDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    get:
    Retorna os detalhes do caso especificado (se pertence ao usuário autenticado).

    put/patch:
    Atualiza os dados do caso.

    delete:
    Remove o caso especificado.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Case.objects.filter(user=self.request.user)

    @swagger_auto_schema(operation_summary="Detalhes, atualização ou exclusão de caso")
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Atualizar caso")
    def put(self, request, *args, **kwargs):
        return super().put(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Atualizar parcialmente caso")
    def patch(self, request, *args, **kwargs):
        return super().patch(request, *args, **kwargs)

    @swagger_auto_schema(operation_summary="Deletar caso")
    def delete(self, request, *args, **kwargs):
        return super().delete(request, *args, **kwargs)


class DocumentUploadView(generics.CreateAPIView):
    """
    post:
    Faz upload de um documento relacionado a um caso existente.
    Campos esperados: file (arquivo), description (string opcional), case (ID do caso).
    """
    serializer_class = DocumentSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    @swagger_auto_schema(operation_summary="Upload de documento para caso", request_body=DocumentSerializer)
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)

    def perform_create(self, serializer):
        case_id = self.request.data.get('case')
        case = get_object_or_404(Case, id=case_id, user=self.request.user)
        serializer.save(case=case)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
@swagger_auto_schema(
    method='patch',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['annotations'],
        properties={
            'annotations': openapi.Schema(type=openapi.TYPE_OBJECT),
        },
    ),
    responses={200: 'Anotações atualizadas com sucesso'}
)
def update_document_annotations(request, pk):
    """
    PATCH:
    Atualiza as anotações JSON de um documento específico.
    """
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
@swagger_auto_schema(
    method='post',
    manual_parameters=[
        openapi.Parameter('final_report', openapi.IN_FORM, description="Arquivo do laudo assinado", type=openapi.TYPE_FILE)
    ],
    responses={200: 'Laudo enviado com sucesso', 400: 'Arquivo não enviado', 404: 'Caso não encontrado'}
)
def upload_signed_report(request, case_id):
    """
    POST:
    Faz upload do arquivo do laudo final assinado para um caso específico.
    """
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
