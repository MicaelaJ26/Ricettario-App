from django.urls import path
from .views import (
    RecipeListView, PublicRecipeListView, CreateRecipeView, 
    DeleteRecipeView, GeneratedRecipeView, MixItUpView, RegisterUserView,UpdateRecipeView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    # Rutas de autenticación
    path('register/', RegisterUserView.as_view(), name='register'),  # Registro de usuarios
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  # Login para obtener JWT
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # Refresca token

    # Rutas de recetas
    path('recipes/', RecipeListView.as_view(), name='recipe_list'),
    path('recipes/public/', PublicRecipeListView.as_view(), name='public_recipe_list'),
    path('recipes/create/', CreateRecipeView.as_view(), name='create_recipe'),
    path('recipes/delete/<int:pk>/', DeleteRecipeView.as_view(), name='delete_recipe'),
    path('recipes/update/<int:pk>/', UpdateRecipeView.as_view(), name='update_recipe'),  

    # Ruta para recetas generadas automáticamente
    path('generated-recipes/', GeneratedRecipeView.as_view(), name='generated_recipe'),
    path('mix-it-up/', MixItUpView.as_view(), name='mix_it_up'),
    path('mix-it-up/<int:recipe_id>/', MixItUpView.as_view(), name='delete_mixed_recipe'),  # Agregar esta línea
]