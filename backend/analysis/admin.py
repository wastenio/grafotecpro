from django.contrib import admin
from .models import Pattern, Quesito, Analysis, Comparison, DocumentVersion

@admin.register(Pattern)
class PatternAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'owner', 'created_at', 'is_active')
    search_fields = ('title', 'owner__email')

@admin.register(Quesito)
class QuesitoAdmin(admin.ModelAdmin):
    list_display = ('id', 'case', 'requester', 'created_at', 'answered_by', 'answered_at')
    search_fields = ('text',)

@admin.register(Analysis)
class AnalysisAdmin(admin.ModelAdmin):
    list_display = ('id', 'case', 'perito', 'status', 'created_at')
    search_fields = ('case__title', 'perito__email')

@admin.register(Comparison)
class ComparisonAdmin(admin.ModelAdmin):
    list_display = ('id', 'analysis', 'pattern', 'document', 'forgery_type', 'created_at')
    search_fields = ('findings',)

@admin.register(DocumentVersion)
class DocumentVersionAdmin(admin.ModelAdmin):
    list_display = ('id', 'document', 'version_number', 'uploaded_at', 'uploaded_by')
