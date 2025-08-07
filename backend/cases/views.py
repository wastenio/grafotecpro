from rest_framework import generics, permissions
from .models import Case, Document
from .serializers import CaseSerializer, CaseCreateSerializer, DocumentSerializer
from rest_framework.parsers import MultiPartParser, FormParser

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
