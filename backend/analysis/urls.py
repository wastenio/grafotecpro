from django.urls import path
from .views import generate_case_report

urlpatterns = [
    path('cases/<int:case_id>/report/', generate_case_report, name='generate-case-report'),
]
