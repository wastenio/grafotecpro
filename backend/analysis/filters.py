import django_filters
from django.db.models import Q
from .models import Analysis

class AnalysisFilter(django_filters.FilterSet):
    # Pesquisa full-text simulada (para PostgreSQL usar SearchVectorField ou SearchQuery)
    search = django_filters.CharFilter(method='full_text_search', label='Busca')

    status = django_filters.MultipleChoiceFilter(
        choices=Analysis.STATUS_CHOICES,
        conjoined=False,
        label='Status'
    )
    date_after = django_filters.DateFilter(field_name='created_at', lookup_expr='gte', label='Data mínima')
    date_before = django_filters.DateFilter(field_name='created_at', lookup_expr='lte', label='Data máxima')
    perito = django_filters.CharFilter(field_name='perito__username', lookup_expr='icontains', label='Perito')

    class Meta:
        model = Analysis
        fields = ['status', 'perito']

    def full_text_search(self, queryset, name, value):
        # Exemplo simples: busca no campo 'observation' e 'conclusion'
        return queryset.filter(
            Q(observation__icontains=value) |
            Q(conclusion__icontains=value)
        )
