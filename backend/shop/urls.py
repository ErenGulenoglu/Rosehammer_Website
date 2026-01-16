from django.urls import path
from .views import paypal_create_order, paypal_capture, delete_order, ProductListView, ProductDetailAPIView, UserOrderListView, UserOrderDetailView # ,create_order

urlpatterns = [
    # path('create_order/', create_order, name='create_order'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<uuid:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),
    path("paypal/create/", paypal_create_order),
    path("paypal/capture/", paypal_capture),
    path("orders/", UserOrderListView.as_view(), name="user-orders"),
    path("orders/<uuid:id>/", UserOrderDetailView.as_view(), name="order-detail"),
    path("orders/<uuid:order_id>/delete/", delete_order),
]