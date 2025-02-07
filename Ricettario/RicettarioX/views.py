from django.contrib.auth import login, logout, authenticate, get_user_model
from django.contrib import messages
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny
from .models import Recipe, GeneratedRecipe
from .serializers import RecipeSerializer, GeneratedRecipeSerializer, RegisterSerializers

import random

# Mensaje de bienvenida como API
class BienvenidaView(APIView):
    def get(self, request):
        message = {
            "message": "Bienvenido a RicettarioX",
            "admin_panel": "/admin/",
            "api_routes": [
                "/api/recipes/",
                "/api/generated-recipes/"
            ]
        }
        return Response(message)   
    

class RegisterUserView(generics.CreateAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = RegisterSerializers
    permission_classes = [AllowAny]  # Permitir acceso a cualquier usuario

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # Genera tokens JWT en lugar de un token simple
            refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Serializador personalizado para JWT con email
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email  # Agregar email al token
        return token


# Vista personalizada para login con JWT
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# API para listar recetas (requiere autenticación)
class RecipeListView(generics.ListAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def get_queryset(self):
        print(f"Solicitud recibida de: {self.request.user}")  # ✅ Verifica el usuario
        queryset = Recipe.objects.filter(user=self.request.user)
        print(f"Recetas encontradas: {queryset}")  # ✅ Verifica las recetas en la terminal
        return queryset


# API para ver recetas públicas
class PublicRecipeListView(APIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [AllowAny]  # Permite acceso público
    authentication_classes = []  

    def get(self, request):
        recipes = Recipe.objects.all()
        serializer = RecipeSerializer(recipes, many=True)
        return Response(serializer.data)


# API para crear una receta (requiere autenticación)
class CreateRecipeView(generics.CreateAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, image=self.request.FILES.get('image'))

# API para eliminar una receta (requiere autenticación)
class DeleteRecipeView(generics.DestroyAPIView):
    serializer_class = RecipeSerializer
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def get_queryset(self):
        return Recipe.objects.filter(user=self.request.user)  # Solo recetas del usuario actual

class UpdateRecipeView(APIView):
    def put(self, request, pk):
        try:
            recipe = Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            return Response({"error": "Receta no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        serializer = RecipeSerializer(recipe, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API para ver recetas generadas automáticamente
class GeneratedRecipeView(APIView):
    permission_classes = [AllowAny]  # Permite acceso sin autenticación

    def get(self, request):
        generated_recipes = GeneratedRecipe.objects.all()
        serializer = GeneratedRecipeSerializer(generated_recipes, many=True)
        return Response(serializer.data)


# API para mezclar recetas (requiere autenticación)
class MixItUpView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden mezclar recetas

    def get(self, request):
        """Obtener todas las recetas generadas"""
        generated_recipes = GeneratedRecipe.objects.all()
        serializer = GeneratedRecipeSerializer(generated_recipes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """Generar y guardar una receta mezclada"""
        all_recipes = Recipe.objects.all()

        if not all_recipes.exists():
            return Response({"message": "No hay recetas para mezclar."}, status=status.HTTP_404_NOT_FOUND)

        ingredients = []
        steps = []

        for recipe in all_recipes:
            if isinstance(recipe.ingredients, str):
                ingredients.extend(recipe.ingredients.split(','))
            else:
                ingredients.extend(recipe.ingredients)

            if isinstance(recipe.steps, str):
                steps.extend(recipe.steps.split('.'))
            else:
                steps.extend(recipe.steps)

        # Mezclar ingredientes y pasos de forma segura
        mixed_ingredients = random.sample(ingredients, min(5, len(ingredients)))  # Máximo 5 ingredientes
        mixed_steps = random.sample(steps, min(3, len(steps)))  # Máximo 3 pasos

        # Generar un título dinámico
        recipe_count = GeneratedRecipe.objects.count() + 1
        new_recipe = GeneratedRecipe.objects.create(
            title=f"Receta Mix It Up #{recipe_count}",
            ingredients=mixed_ingredients,
            steps=mixed_steps
        )

        serializer = GeneratedRecipeSerializer(new_recipe)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def delete(self, request, recipe_id=None):
        """Eliminar una receta generada"""
        recipe_id = request.parser_context['kwargs'].get('recipe_id')  # Obtener el ID desde la URL

        if not recipe_id:
            return Response({"message": "Se requiere un ID de receta."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            recipe = GeneratedRecipe.objects.get(id=recipe_id)
            recipe.delete()
            return Response({"message": "Receta eliminada correctamente."}, status=status.HTTP_204_NO_CONTENT)
        except GeneratedRecipe.DoesNotExist:
            return Response({"message": "Receta no encontrada."}, status=status.HTTP_404_NOT_FOUND)
