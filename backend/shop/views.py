from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Order, OrderItem, Product
from .serializers import ProductSerializer, CreateOrderSerializer, OrderSerializer
from .paypal import create_paypal_order, capture_paypal_order

from django.http import HttpResponse

# Create your views here.
class ProductListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class ProductDetailAPIView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

class UserOrderListView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).order_by("-created_at")
    
class UserOrderDetailView(RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def get_queryset(self):
        # 🔒 user can ONLY see their own orders
        return Order.objects.filter(user=self.request.user)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_order(request, order_id):
    try:
        order = Order.objects.get(id=order_id, user=request.user)
    except Order.DoesNotExist:
        return Response(
            {"detail": "Order not found."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Safety rule: prevent deleting paid orders
    if order.is_paid:
        return Response(
            {"detail": "Paid orders cannot be deleted."},
            status=status.HTTP_400_BAD_REQUEST
        )

    order.delete()
    return Response(
        {"message": "Order deleted successfully."},
        status=status.HTTP_204_NO_CONTENT
    )

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def create_order(request):
#     data = request.data

#     required_fields = [
#         "firstName", "lastName", "street_address", "city",
#         "postalCode", "country", "items"
#     ]

#     for field in required_fields:
#         if field not in data:
#             return Response({"detail": f"Missing {field}"}, status=400)

#     items = data["items"]
#     if not items:
#         return Response({"detail": "Cart is empty"}, status=400)

#     # Calculate total
#     total = sum(
#         float(Product.objects.get(id=item["id"]).price)
#         for item in items
#     )

#     # Create Order
#     order = Order.objects.create(
#         user=request.user,
#         firstName=data["firstName"],
#         lastName=data["lastName"],
#         street_address=data["street_address"],
#         city=data["city"],
#         state=data.get("state", ""),
#         postalCode=data["postalCode"],
#         country=data["country"],
#         total_amount=total,
#     )

#     # Create Order Items
#     for item in items:
#         product = Product.objects.get(id=item["id"])
#         OrderItem.objects.create(
#             order=order,
#             product=product,
#             price_at_purchase=product.price
#         )

#     return Response({
#         "message": "Order created",
#         "order_id": order.id
#     })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def paypal_create_order(request):
    """
    Create an order in Django and a corresponding PayPal order.
    """
    serializer = CreateOrderSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    data = serializer.validated_data

    # data = request.data
    required_fields = ["firstName", "lastName", "street_address", "city", "state", "postalCode", "country", "items"]
    for field in required_fields:
        if field not in data:
            return Response({"detail": f"Missing {field}"}, status=400)

    items = data["items"]
    if not items:
        return Response({"detail": "Cart is empty"}, status=400)

    # Calculate total
    total = sum(float(Product.objects.get(id=item["id"]).price) for item in items)

    # Create PayPal order
    paypal_data = create_paypal_order(total)
    paypal_order_id = paypal_data["id"]

    # Create Django order (pending payment)
    # print(request.user)
    # print(data["firstName"])
    # print(data["lastName"])
    # print(data["street_address"])
    # print(data["city"])
    # print(data.get("state", ""))
    # print(data["postalCode"])
    # print(data["country"])
    order = Order.objects.create(
        user=request.user,
        firstName=data["firstName"],
        lastName=data["lastName"],
        street_address=data["street_address"],
        city=data["city"],
        state=data.get("state", ""),
        postalCode=data["postalCode"],
        country=data["country"],
        total_amount=total,
        is_paid=False
    )

    # Add order items
    for item in items:
        try:
            product = Product.objects.get(id=item["id"])
        except Product.DoesNotExist:
            return Response(
                {"detail": f"Invalid product ID {item['id']}"},
                status=400
            )
        OrderItem.objects.create(
            order=order,
            product=product,
            price_at_purchase=product.price
        )

    return Response({
        "message": "Order created",
        "django_order_id": str(order.id),
        "paypal_order_id": paypal_order_id,
        "paypal_data": paypal_data,
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def paypal_capture(request):

    paypal_order_id = request.data.get("paypal_order_id")
    django_order_id = request.data.get("django_order_id")

    if not paypal_order_id or not django_order_id:
        return Response({"detail": "Missing PayPal or Order ID"}, status=400)

    # Capture payment on PayPal
    capture_result = capture_paypal_order(paypal_order_id)
    if capture_result.get("status") != "COMPLETED":
        return Response({
            "detail": "PayPal did not confirm payment.",
            "paypal_response": capture_result
        }, status=400)

    # Mark order paid
    try:
        order = Order.objects.get(id=django_order_id)
    except Order.DoesNotExist:
        return Response({"detail": "Order not found"}, status=404)
    order.is_paid = True
    order.save()

    return Response({
        "status": "completed",
        "order_id": str(order.id),
        "paypal_response": capture_result
    })