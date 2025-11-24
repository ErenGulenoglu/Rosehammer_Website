from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Order, OrderItem, Product
from .serializers import ProductSerializer

# Create your views here.
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    data = request.data
    items = data.get("items", [])

    if not items:
        return Response({"detail": "Cart is empty"}, status=400)

    # Create the order
    order = Order.objects.create(
        user=request.user,
        address=data["address"],
        total_amount=sum(
            float(Product.objects.get(id=item["id"]).price) for item in items
        )
    )

    # Create order items
    for item in items:
        product = Product.objects.get(id=item["id"])
        OrderItem.objects.create(order=order, product=product)

    return Response({"message": "Order created", "order_id": order.id})