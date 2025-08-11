from django.urls import path
from .views import (
    AnalysisCreateView,
    CaseAnalysisListView,
    AnalysisUpdateView,
    # AnalysisDeleteView,
    generate_case_report,
)

urlpatterns = [
    path('<int:case_id>/create/', AnalysisCreateView.as_view(), name='analysis-create'),  # /api/analysis/<case_id>/create/
    path('<int:case_id>/list/', CaseAnalysisListView.as_view(), name='analysis-list'),    # /api/analysis/<case_id>/list/
    path('<int:pk>/edit/', AnalysisUpdateView.as_view(), name='analysis-update'),         # /api/analysis/<analysis_id>/edit/
    # path('<int:pk>/delete/', AnalysisDeleteView.as_view(), name='analysis-delete'),       # /api/analysis/<analysis_id>/delete/
    path('<int:case_id>/report/', generate_case_report, name='generate-case-report'),      # /api/analysis/<case_id>/report/
]
