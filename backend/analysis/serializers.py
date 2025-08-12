from rest_framework import serializers
from .models import Pattern, Quesito, Analysis, Comparison, DocumentVersion, ForgeryType
from cases.serializers import DocumentSerializer  # reaproveite se existir
from cases.models import Document
from .models import Comment

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

    # Novos campos para versão detalhada (somente leitura)
    pattern_version_detail = serializers.SerializerMethodField()
    document_version_detail = serializers.SerializerMethodField()

    forgery_type = serializers.CharField(source='forgery_types.first.name', read_only=True)  # Ajustado para ManyToMany

    class Meta:
        model = Comparison
        fields = '__all__'
        read_only_fields = ['created_at']

    def get_pattern_version_detail(self, obj):
        if obj.pattern_version:
            return {
                'id': obj.pattern_version.id,
                'file_name': obj.pattern_version.file.name,
                'version_number': obj.pattern_version.version_number,
                'uploaded_at': obj.pattern_version.uploaded_at,
            }
        return None

    def get_document_version_detail(self, obj):
        if obj.document_version:
            return {
                'id': obj.document_version.id,
                'file_name': obj.document_version.file.name,
                'version_number': obj.document_version.version_number,
                'uploaded_at': obj.document_version.uploaded_at,
            }
        return None


class ComparisonCreateUpdateSerializer(serializers.ModelSerializer):
    # Agora forgery_type é FK editável via ID
    forgery_type = serializers.PrimaryKeyRelatedField(queryset=ForgeryType.objects.all(), allow_null=True, required=False)
    pattern_version = serializers.PrimaryKeyRelatedField(
        queryset=DocumentVersion.objects.all(), allow_null=True, required=False
    )
    document_version = serializers.PrimaryKeyRelatedField(
        queryset=DocumentVersion.objects.all(), allow_null=True, required=False
    )

    class Meta:
        model = Comparison
        fields = [
            'analysis', 'pattern', 'document',
            'pattern_version', 'document_version',
            'similarity_score', 'findings', 'forgery_type'
        ]

    def validate(self, data):
        # Exemplo simples: garantir que pattern_version pertence ao pattern
        pattern = data.get('pattern')
        pattern_version = data.get('pattern_version')
        if pattern_version and pattern_version.document != pattern:
            raise serializers.ValidationError("pattern_version não pertence ao pattern selecionado.")
        
        document = data.get('document')
        document_version = data.get('document_version')
        if document_version and document_version.document != document:
            raise serializers.ValidationError("document_version não pertence ao document selecionado.")
        
        return data




class DocumentVersionSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.PrimaryKeyRelatedField(read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = DocumentVersion
        fields = ['id', 'document', 'file', 'version_number', 'uploaded_at', 'uploaded_by', 'changelog']
        read_only_fields = ['uploaded_at', 'uploaded_by', 'version_number', 'file_url']
        
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None


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
        fields = ['id', 'name', 'description', 'example_image', 'owner']
        read_only_fields = ['owner']

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['owner'] = user
        return super().create(validated_data)
    
class ComparisonDetailResultSerializer(serializers.ModelSerializer):
    pattern_file_url = serializers.SerializerMethodField()
    document_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Comparison
        fields = ['id', 'similarity_score', 'automatic_result', 'pattern_file_url', 'document_file_url']

    def get_pattern_file_url(self, obj):
        if obj.pattern_version and obj.pattern_version.file:
            return obj.pattern_version.file.url
        elif obj.pattern and obj.pattern.file:
            return obj.pattern.file.url
        return None

    def get_document_file_url(self, obj):
        if obj.document_version and obj.document_version.file:
            return obj.document_version.file.url
        elif obj.document and obj.document.file:
            return obj.document.file.url
        return None
    
class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    author_email = serializers.EmailField(source='author.email', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            'id', 'case', 'author', 'author_name', 'author_email', 
            'analysis', 'parent', 'text', 'created_at', 'updated_at', 'replies'
        ]
        read_only_fields = ['id', 'author', 'author_name', 'author_email', 'created_at', 'updated_at', 'replies']

    def get_replies(self, obj):
        replies_qs = obj.replies.all().order_by('created_at')
        return CommentSerializer(replies_qs, many=True).data

    def validate(self, attrs):
        parent = attrs.get('parent')
        case = attrs.get('case')
        if parent and parent.case != case:
            raise serializers.ValidationError("O comentário pai deve pertencer ao mesmo caso.")
        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['author'] = user
        return super().create(validated_data)