from django.urls import path
from .views import (
    PatternListCreateView, PatternDetailView,
    QuesitoListCreateView,
    AnalysisCreateView, CaseAnalysisListView, 
    # AnalysisDetailView,
    ComparisonListCreateView,
    DocumentVersionListCreateView, QuesitoRetrieveUpdateDeleteView, generate_case_report,
)

urlpatterns = [
    # Patterns
    path('patterns/', PatternListCreateView.as_view(), name='pattern-list-create'),
    path('patterns/<int:pk>/', PatternDetailView.as_view(), name='pattern-detail'),

    # Quesitos (per case)
    path('cases/<int:case_id>/quesitos/', QuesitoListCreateView.as_view(), name='case-quesitos'),
    path('quesitos/<int:pk>/', QuesitoRetrieveUpdateDeleteView.as_view(), name='quesito-detail'),

    # Analyses
    path('cases/<int:case_id>/analyses/create/', AnalysisCreateView.as_view(), name='analysis-create'),
    path('cases/<int:case_id>/analyses/', CaseAnalysisListView.as_view(), name='case-analyses'),
    # path('analyses/<int:pk>/', AnalysisDetailView.as_view(), name='analysis-detail'),

    # Comparisons
    path('analyses/<int:analysis_id>/comparisons/', ComparisonListCreateView.as_view(), name='analysis-comparisons'),

    # Document versions
    path('documents/<int:document_id>/versions/', DocumentVersionListCreateView.as_view(), name='document-versions'),
    
    # Relatório
    path('cases/<int:case_id>/report/', generate_case_report, name='generate-case-report'),
]
