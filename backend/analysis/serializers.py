from rest_framework import serializers
from .models import Pattern, Quesito, Analysis, Comparison, DocumentVersion, ForgeryType
from cases.serializers import DocumentSerializer  # reaproveite se existir
from cases.models import Document

class PatternSerializer(serializers.ModelSerializer):
    uploaded_document = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Pattern
        fields = ['id', 'owner', 'title', 'description', 'uploaded_document', 'metadata', 'tags', 'created_at', 'is_active']
        read_only_fields = ['owner', 'created_at']


class QuesitoSerializer(serializers.ModelSerializer):
    answered_by_email = serializers.EmailField(source='answered_by.email', read_only=True)

    class Meta:
        model = Quesito
        fields = [
            'id', 'case', 'requester', 'text', 'created_at',
            'answered_text', 'answered_by', 'answered_by_email', 'answered_at'
        ]
        read_only_fields = ['created_at', 'answered_by_email', 'answered_at']


class ComparisonSerializer(serializers.ModelSerializer):
    pattern_detail = PatternSerializer(source='pattern', read_only=True)
    document_detail = serializers.PrimaryKeyRelatedField(source='document', read_only=True)
    forgery_type = serializers.CharField(source='forgery_type.name', read_only=True)  # Exibir nome no GET

    class Meta:
        model = Comparison
        fields = ['id', 'analysis', 'pattern', 'pattern_detail', 'document', 'document_detail', 'similarity_score', 'findings', 'forgery_type', 'created_at']
        read_only_fields = ['created_at']


class ComparisonCreateUpdateSerializer(serializers.ModelSerializer):
    # Agora forgery_type é FK editável via ID
    forgery_type = serializers.PrimaryKeyRelatedField(queryset=ForgeryType.objects.all(), allow_null=True, required=False)

    class Meta:
        model = Comparison
        fields = ['analysis', 'pattern', 'document', 'similarity_score', 'findings', 'forgery_type']

    def validate(self, data):
        # Pode adicionar validações extras aqui, se quiser
        return data


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
    quesitos = serializers.SerializerMethodField() 

    class Meta:
        model = Analysis
        fields = [
            'id', 'case', 'document_original', 'document_contested',
            'observation', 'methodology', 'conclusion', 'created_at',
            'perito', 'status', 'comparisons', 'quesitos'
        ]
        read_only_fields = ['created_at', 'perito', 'comparisons', 'quesitos']

    def get_quesitos(self, obj):
        # retorna quesitos vinculados ao case do analysis
        quesitos = obj.case.quesitos.all()
        return QuesitoSerializer(quesitos, many=True).data

class ForgeryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForgeryType
        fields = ['id', 'name', 'description']