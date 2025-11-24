from rest_framework import serializers
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from .models import User
import string

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    passwordConfirm = serializers.CharField(write_only=True)  # for confirm check

    class Meta:
        model = User
        fields = ['id', 'email', "first_name", "last_name", "password", "passwordConfirm"] # include only safe fields

    def validate_email(self, value):
        try:
            validate_email(value)
        except ValidationError:
            raise serializers.ValidationError("Invalid email format.")
        return value
    
    def validate_password(self, value):
        """Custom password rules"""
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters.")
        if len(value) > 16:
            raise serializers.ValidationError("Password must not exceed 16 characters.")
        if not any(char.isdigit() for char in value):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not any(char.isalpha() for char in value):
            raise serializers.ValidationError("Password must contain at least one letter.")
        if not any(char.isupper() for char in value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not any(char in string.punctuation for char in value):
            raise serializers.ValidationError("Password must contain at least one special symbol. (e.g., !@#$%^&*()_+[]{}|;:',.<>?)")
        return value
    
    def validate(self, data):
        """Check password confirmation"""
        if data['password'] != data['passwordConfirm']:
            raise serializers.ValidationError({"passwordConfirm": "Passwords do not match."})
        return data
    
    def create(self, validated_data):
        validated_data.pop('passwordConfirm')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user