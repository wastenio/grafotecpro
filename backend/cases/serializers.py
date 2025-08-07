from rest_framework import serializers
from .models import Case, Document

class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id', 'file', 'description', 'uploaded_at', 'annotations']

class CaseSerializer(serializers.ModelSerializer):
    documents = DocumentSerializer(many=True, read_only=True)

    class Meta:
        model = Case
        fields = ['id', 'title', 'description', 'status', 'created_at', 'documents']

class CaseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Case
        fields = ['title', 'description', 'status']
