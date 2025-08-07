from django.urls import path
from .views import CaseListCreateView, CaseDetailView, DocumentUploadView, update_document_annotations

urlpatterns = [
    path('cases/', CaseListCreateView.as_view(), name='case-list-create'),
    path('cases/<int:pk>/', CaseDetailView.as_view(), name='case-detail'),
    path('documents/upload/', DocumentUploadView.as_view(), name='document-upload'),
    path('documents/<int:pk>/annotations/', update_document_annotations, name='document-update-annotations'),
]
