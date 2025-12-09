from rest_framework import serializers
from .models import Product, Order, OrderItem
import re

class ProductSerializer(serializers.ModelSerializer): # Reading Only Serializer
    class Meta:
        model = Product
        fields = '__all__'

class OrderItemSerializer(serializers.ModelSerializer): # Reading Only Serializer
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', "order", 'product', 'price_at_purchase']

class OrderSerializer(serializers.ModelSerializer): # Reading Only Serializer
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'firstName', 'lastName', 'street_address', 'city', 'state', 'postalCode', 'country', 'total_amount', 'is_paid', 'created_at', 'items']

class CreateOrderSerializer(serializers.Serializer): # Validating Only Serializer
    firstName = serializers.CharField(max_length=100)
    lastName = serializers.CharField(max_length=100)
    street_address = serializers.CharField(max_length=255)
    city = serializers.CharField(max_length=100)
    state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    postalCode = serializers.CharField(max_length=20)
    country = serializers.CharField(max_length=100)

    items = serializers.ListField( # These are the UUIDs of the products
        child=serializers.DictField(), allow_empty=False
    )

    def validate_country(self, data):
        valid_countries = ["United States", "Canada", "United Kingdom", "Germany", "France"]
        if data not in valid_countries:
            raise serializers.ValidationError("Invalid country.")
        return data

    def validate_postalCode(self, data):
        country = self.initial_data.get("country", "")

        patterns = {
            "United States": r"^\d{5}(-\d{4})?$",
            "Canada": r"^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$",
            "United Kingdom": r"^[A-Za-z]{1,2}\d[A-Za-z\d]? \d[A-Za-z]{2}$",
            "Germany": r"^\d{5}$",
            "France": r"^\d{5}$",
        }

        if country in patterns and not re.match(patterns[country], data):
            raise serializers.ValidationError(f"Invalid postal code for {country}.")
        return data
    
    def validate(self, data):
        items = self.initial_data.get("items", [])

        if not items:
            raise serializers.ValidationError({"items": "Cart cannot be empty."})
        
        for item in items:
            if "id" not in item:
                raise serializers.ValidationError({"items": "Each item must have an 'id'."})
            if not Product.objects.filter(id=item["id"]).exists():
                raise serializers.ValidationError({"items": f"Product with ID {item['id']} does not exist."})

        return data