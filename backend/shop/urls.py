from django.urls import path
from .views import create_order, ProductListView, ProductDetailAPIView

urlpatterns = [
    path('create_order/', create_order, name='create_order'),
    path('products/', ProductListView.as_view(), name='product-list'),
    path('products/<uuid:pk>/', ProductDetailAPIView.as_view(), name='product-detail'),
]