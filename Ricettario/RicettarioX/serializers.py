from rest_framework import serializers
from django.contrib.auth import get_user_model
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password
from django.conf import settings

from .models import CustomUser
from .models import Recipe
from .models import GeneratedRecipe

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        email = attrs.get("email")  # Cambiamos a email en vez de username
        password = attrs.get("password")

        user = authenticate(email=email, password=password)

        if not user:
            raise serializers.ValidationError({"error": "Credenciales incorrectas"})

        return super().validate(attrs)


class UserSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    is_staff = serializers.BooleanField(read_only=True)  # Evita que los usuarios lo modifiquen

    class Meta:
        model = get_user_model()
        fields = ('id', 'email', 'password', 'first_name', 'last_name', 'is_staff')

class RegisterSerializers(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'password2', 'first_name', 'last_name')  # Quitamos 'is_staff'

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Las contraseñas no coinciden."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)  # Se crea sin permisos de admin
        return user


class RecipeSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True) 
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    # image_url = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'user', 'title', 'description', 'ingredients', 'steps', 'image', 'created_at', 'updated_at']
    
    # def get_image_url(self, obj):
    #     if obj.image:
    #         request = self.context.get('request')  
    #         if request:
    #             return request.build_absolute_uri(obj.image.url)  
    #         return obj.image.url  
    #     return None
class GeneratedRecipeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedRecipe
        fields = '__all__'
        
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'date_joined')  # Excluimos campos sensibles

