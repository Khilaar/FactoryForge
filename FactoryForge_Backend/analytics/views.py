
from rest_framework.generics import ListCreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from analytics.models import Analytics
from analytics.serializers import AnalyticsSerializer
from analytics.services import calculate_profit, used_rawmats_and_sold_products
from factoryforge.permissions.permissions import ReadOnly


#######################################################################################################

class ListCreateAnalyticsView(ListCreateAPIView):
    queryset = Analytics.objects.all()
    serializer_class = AnalyticsSerializer
    permission_classes = [IsAuthenticated | ReadOnly]


#######################################################################################################

class ProfitView(APIView):
    permission_classes = [IsAuthenticated | ReadOnly]

    def get(self, request):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        results = calculate_profit(start_date, end_date)
        return Response(results)


#######################################################################################################

class UsedRawMaterialsSoldProductsView(ListAPIView):
    permission_classes = [IsAuthenticated | ReadOnly]

    def get(self, request, *args, **kwargs):
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        results = used_rawmats_and_sold_products(start_date, end_date)
        used_material = results[0]
        sold_products = results[1]
        return Response([{"Used Material": used_material}, {"Sold Products": sold_products}])
