from rest_framework import serializers
from .models import Pattern, Quesito, Analysis, Comparison, DocumentVersion
from cases.serializers import DocumentSerializer  # reaproveite se existir
from cases.models import Document

class PatternSerializer(serializers.ModelSerializer):
    uploaded_document = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Pattern
        fields = ['id', 'owner', 'title', 'description', 'uploaded_document', 'metadata', 'tags', 'created_at', 'is_active']
        read_only_fields = ['owner', 'created_at']


class QuesitoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quesito
        fields = ['id', 'case', 'requester', 'text', 'created_at', 'answered_text', 'answered_by', 'answered_at']
        read_only_fields = ['created_at', 'answered_by', 'answered_at']


class ComparisonSerializer(serializers.ModelSerializer):
    pattern_detail = PatternSerializer(source='pattern', read_only=True)
    document_detail = serializers.PrimaryKeyRelatedField(source='document', read_only=True)

    class Meta:
        model = Comparison
        fields = ['id', 'analysis', 'pattern', 'pattern_detail', 'document', 'document_detail', 'similarity_score', 'findings', 'forgery_type', 'created_at']
        read_only_fields = ['created_at']


class DocumentVersionSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = DocumentVersion
        fields = ['id', 'document', 'file', 'version_number', 'uploaded_at', 'uploaded_by', 'changelog']
        read_only_fields = ['uploaded_at', 'uploaded_by']


class AnalysisSerializer(serializers.ModelSerializer):
    comparisons = ComparisonSerializer(many=True, read_only=True)
    case = serializers.PrimaryKeyRelatedField(read_only=True)
    perito = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Analysis
        fields = ['id', 'case', 'document_original', 'document_contested', 'observation', 'methodology', 'conclusion', 'created_at', 'perito', 'status', 'comparisons']
        read_only_fields = ['created_at', 'perito', 'comparisons']
