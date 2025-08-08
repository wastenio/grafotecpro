from django.urls import path
from .views import (
    CaseListCreateView,
    CaseDetailView,
    DocumentUploadView,
    update_document_annotations,
    upload_signed_report,
)

urlpatterns = [
    path('', CaseListCreateView.as_view(), name='case-list-create'),  # /api/cases/
    path('<int:pk>/', CaseDetailView.as_view(), name='case-detail'),  # /api/cases/<id>/
    path('documents/upload/', DocumentUploadView.as_view(), name='document-upload'),  # /api/cases/documents/upload/
    path('documents/<int:pk>/annotations/', update_document_annotations, name='document-update-annotations'),  # /api/cases/documents/<id>/annotations/
    path('<int:case_id>/upload-signed-report/', upload_signed_report, name='upload-signed-report'),  # /api/cases/<id>/upload-signed-report/
]
