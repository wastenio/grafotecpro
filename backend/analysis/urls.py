from django.urls import path
from .views import (
    PatternListCreateView, PatternDetailView,
    QuesitoListCreateView, QuesitoAnswerView,
    AnalysisCreateView, CaseAnalysisListView, 
    # AnalysisDetailView,
    ComparisonListCreateView,
    DocumentVersionListCreateView,
)

urlpatterns = [
    # Patterns
    path('patterns/', PatternListCreateView.as_view(), name='pattern-list-create'),
    path('patterns/<int:pk>/', PatternDetailView.as_view(), name='pattern-detail'),

    # Quesitos (per case)
    path('cases/<int:case_id>/quesitos/', QuesitoListCreateView.as_view(), name='case-quesitos'),
    path('quesitos/<int:pk>/responder/', QuesitoAnswerView.as_view(), name='quesito-answer'),

    # Analyses
    path('cases/<int:case_id>/analyses/create/', AnalysisCreateView.as_view(), name='analysis-create'),
    path('cases/<int:case_id>/analyses/', CaseAnalysisListView.as_view(), name='case-analyses'),
    # path('analyses/<int:pk>/', AnalysisDetailView.as_view(), name='analysis-detail'),

    # Comparisons
    path('analyses/<int:analysis_id>/comparisons/', ComparisonListCreateView.as_view(), name='analysis-comparisons'),

    # Document versions
    path('documents/<int:document_id>/versions/', DocumentVersionListCreateView.as_view(), name='document-versions'),
]
