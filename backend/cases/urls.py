from django.urls import path
from .views import CaseListCreateView, CaseDetailView, DocumentUploadView, update_document_annotations
from .views import AnalysisCreateView

urlpatterns = [
    path('cases/', CaseListCreateView.as_view(), name='case-list-create'),
    path('cases/<int:pk>/', CaseDetailView.as_view(), name='case-detail'),
    path('documents/upload/', DocumentUploadView.as_view(), name='document-upload'),
    path('documents/<int:pk>/annotations/', update_document_annotations, name='document-update-annotations'),
    path('cases/<int:case_id>/analysis/', AnalysisCreateView.as_view(), name='analysis-create'),
]
