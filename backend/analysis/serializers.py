from rest_framework import serializers
from .models import Pattern, Quesito, Analysis, Comparison, DocumentVersion, ForgeryType
from cases.serializers import DocumentSerializer  # reaproveite se existir
from cases.models import Document
from .models import Comment

# --- PatternSerializer ---
class PatternSerializer(serializers.ModelSerializer):
    uploaded_document = serializers.PrimaryKeyRelatedField(queryset=Document.objects.all(), required=False, allow_null=True)

    class Meta:
        model = Pattern
        fields = ['id', 'owner', 'title', 'description', 'uploaded_document', 'metadata', 'tags', 'created_at', 'is_active']
        read_only_fields = ['owner', 'created_at']

# --- QuesitoSerializer ---
class QuesitoSerializer(serializers.ModelSerializer):
    answered_by_email = serializers.EmailField(source='answered_by.email', read_only=True)

    class Meta:
        model = Quesito
        fields = [
            'id', 'case', 'requester', 'text', 'created_at',
            'answered_text', 'answered_by', 'answered_by_email', 'answered_at'
        ]
        read_only_fields = ['created_at', 'answered_by_email', 'answered_at']

# --- ComparisonSerializer (read-only serializer para GET) ---
class ComparisonSerializer(serializers.ModelSerializer):
    pattern_detail = PatternSerializer(source='pattern', read_only=True)
    document_detail = serializers.PrimaryKeyRelatedField(source='document', read_only=True)

    # Novos campos para versão detalhada (somente leitura)
    pattern_version_detail = serializers.SerializerMethodField()
    document_version_detail = serializers.SerializerMethodField()

    # MELHORIA: Ajuste para ManyToMany de forgery_types para mostrar lista de nomes
    forgery_types = serializers.SlugRelatedField(many=True, read_only=True, slug_field='name')

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

# --- ComparisonCreateUpdateSerializer (para POST/PUT/PATCH) ---
class ComparisonCreateUpdateSerializer(serializers.ModelSerializer):
    # MELHORIA: permitir edição via PK de forgery_type, pattern_version e document_version
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

    # MELHORIA: validações mais robustas com mensagens claras
    def validate(self, data):
        pattern = data.get('pattern')
        pattern_version = data.get('pattern_version')
        document = data.get('document')
        document_version = data.get('document_version')

        if pattern_version:
            if pattern_version.document != pattern:
                raise serializers.ValidationError("A versão do padrão selecionada não pertence ao padrão informado.")
        if document_version:
            if document_version.document != document:
                raise serializers.ValidationError("A versão do documento selecionada não pertence ao documento informado.")

        forgery_type = data.get('forgery_type')
        if forgery_type and not ForgeryType.objects.filter(id=forgery_type.id).exists():
            raise serializers.ValidationError("Tipo de falsificação inválido.")

        return data

# --- DocumentVersionSerializer ---
class DocumentVersionSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.PrimaryKeyRelatedField(read_only=True)
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = DocumentVersion
        fields = ['id', 'document', 'file', 'version_number', 'uploaded_at', 'uploaded_by', 'changelog']
        read_only_fields = ['uploaded_at', 'uploaded_by', 'version_number', 'file_url']

    # MELHORIA: retorna URL completa do arquivo para acesso externo
    def get_file_url(self, obj):
        request = self.context.get('request')
        if obj.file and request:
            return request.build_absolute_uri(obj.file.url)
        return None

# --- AnalysisSerializer ---
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

    # MELHORIA: evitar queries N+1, prefetch em get_queryset na view
    def get_quesitos(self, obj):
        quesitos = obj.case.quesitos.all()
        return QuesitoSerializer(quesitos, many=True).data

# --- ForgeryTypeSerializer ---
class ForgeryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForgeryType
        fields = ['id', 'name', 'description', 'example_image', 'owner']
        read_only_fields = ['owner']

    # MELHORIA: atribuir owner no create via contexto
    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['owner'] = user
        return super().create(validated_data)

# --- ComparisonDetailResultSerializer ---
class ComparisonDetailResultSerializer(serializers.ModelSerializer):
    # MELHORIA: URLs completas usando request no contexto
    pattern_file_url = serializers.SerializerMethodField()
    document_file_url = serializers.SerializerMethodField()

    class Meta:
        model = Comparison
        fields = ['id', 'similarity_score', 'automatic_result', 'pattern_file_url', 'document_file_url']

    def get_pattern_file_url(self, obj):
        request = self.context.get('request')
        url = None
        if obj.pattern_version and obj.pattern_version.file:
            url = obj.pattern_version.file.url
        elif obj.pattern and obj.pattern.file:
            url = obj.pattern.file.url
        if url and request:
            return request.build_absolute_uri(url)
        return url

    def get_document_file_url(self, obj):
        request = self.context.get('request')
        url = None
        if obj.document_version and obj.document_version.file:
            url = obj.document_version.file.url
        elif obj.document and obj.document.file:
            url = obj.document.file.url
        if url and request:
            return request.build_absolute_uri(url)
        return url

# --- CommentSerializer ---
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

    # MELHORIA: limitar profundidade / quantidade de replies para evitar recursão pesada
    def get_replies(self, obj):
        replies_qs = obj.replies.all().order_by('created_at')[:10]  # limitar a 10 replies para performance
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
