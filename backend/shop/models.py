import uuid
from django.db import models
from django.conf import settings

# Create your models here.

class Product(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.ImageField(upload_to="products/")
    type = models.CharField(max_length=100)
    rating = models.FloatField(default=0.0)
    rating_count = models.PositiveIntegerField(default=0)
    

    def __str__(self):
        return self.name
    
class Order(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    firstName = models.CharField(max_length=100)
    lastName = models.CharField(max_length=100)
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postalCode = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    
    created_at = models.DateTimeField(auto_now_add=True)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    

    def __str__(self):
        return f"Order {self.id}"

class OrderItem(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    

    def __str__(self):
        return f"{self.product.name} in Order {self.order.id}"