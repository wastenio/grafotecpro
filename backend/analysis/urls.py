from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ComparisonDetailResultView, ForgeryTypeDetailView, ForgeryTypeListCreateView, PatternListCreateView, PatternDetailView,
    QuesitoListCreateView, QuesitoRetrieveUpdateDeleteView,
    AnalysisCreateView, CaseAnalysisListView,
    ComparisonListCreateView,
    DocumentVersionListCreateView, download_document_version,
    generate_case_report,
    AnalysisViewSet,
    ForgeryTypeViewSet,
)
from .views import CommentViewSet

router = DefaultRouter()
router.register(r'analyses', AnalysisViewSet, basename='analysis')
router.register(r'forgery-types', ForgeryTypeViewSet, basename='forgerytype')
router.register(r'comments', CommentViewSet, basename='comments')


urlpatterns = [
    # Patterns
    path('patterns/', PatternListCreateView.as_view(), name='pattern-list-create'),
    path('patterns/<int:pk>/', PatternDetailView.as_view(), name='pattern-detail'),

    # Quesitos (por case)
    path('cases/<int:case_id>/quesitos/', QuesitoListCreateView.as_view(), name='case-quesitos'),
    path('quesitos/<int:pk>/', QuesitoRetrieveUpdateDeleteView.as_view(), name='quesito-detail'),

    # Analyses - rotas customizadas
    path('cases/<int:case_id>/analyses/create/', AnalysisCreateView.as_view(), name='analysis-create'),
    path('cases/<int:case_id>/analyses/', CaseAnalysisListView.as_view(), name='case-analyses'),

    # Comparisons
    path('analyses/<int:analysis_id>/comparisons/', ComparisonListCreateView.as_view(), name='comparison-list-create'),

    # Document versions
    path('documents/<int:document_id>/versions/', DocumentVersionListCreateView.as_view(), name='document-version-list-create'),
    path('documents/versions/<int:version_id>/download/', download_document_version, name='document-version-download'),

    # Relatório customizado
    path('cases/<int:case_id>/report/', generate_case_report, name='generate-case-report'),

    # Rotas automáticas via router (RESTful para Analysis e ForgeryType)
    path('', include(router.urls)),
    
    path('forgery-types/', ForgeryTypeListCreateView.as_view(), name='forgerytype-list-create'),
    path('forgery-types/<int:pk>/', ForgeryTypeDetailView.as_view(), name='forgerytype-detail'),
    
    path('comparisons/<int:pk>/detail_result/', ComparisonDetailResultView.as_view(), name='comparison-detail-result'),
    
]
