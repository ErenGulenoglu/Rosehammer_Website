from django.urls import path
from .views import paypal_create_order, paypal_capture, ProductListView, ProductDetailAPIView # ,create_order

urlpatterns = [
    # path('create_order/', create_order, name='create_order'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<uuid:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),
    path("paypal/create/", paypal_create_order),
    path("paypal/capture/", paypal_capture),
]