import django_filters
from django.db.models import Q
from .models import Case, Analysis
from django_filters import rest_framework as filters
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank


class CaseFilter(filters.FilterSet):
    search = filters.CharFilter(method='full_text_search')
    status = filters.CharFilter(field_name='status')
    date_from = filters.DateFilter(field_name='created_at', lookup_expr='gte')
    date_to = filters.DateFilter(field_name='created_at', lookup_expr='lte')
    perito = filters.NumberFilter(field_name='user__id')

    class Meta:
        model = Case
        fields = ['status', 'perito']

    def full_text_search(self, queryset, name, value):
        vector = SearchVector('title', 'description')
        query = SearchQuery(value)
        return queryset.annotate(rank=SearchRank(vector, query)).filter(rank__gte=0.1).order_by('-rank')
    
    
class AnalysisFilter(django_filters.FilterSet):
    # Pesquisa full-text simulada (para PostgreSQL usar SearchVectorField ou SearchQuery)
    search = filters.CharFilter(method='full_text_search')

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
        fields = {
            'status': ['exact'],
            'created_at': ['gte', 'lte'],
            'case__user__id': ['exact'],
            # outros campos que quiser filtrar diretamente
        }

    def full_text_search(self, queryset, name, value):
        return queryset.annotate(
            search=SearchVector('observation', 'conclusion', 'methodology', 'case__description'),
        ).filter(search=value)
