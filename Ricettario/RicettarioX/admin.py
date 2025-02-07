from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, Recipe, GeneratedRecipe

# Personalización de la administración de usuarios
class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = ("email", "is_staff", "is_active", "date_joined")  # Columnas visibles en la lista de usuarios
    list_filter = ("is_staff", "is_active")  # Filtros en la barra lateral
    ordering = ("email",)  # Ordenar por email
    search_fields = ("email",)  # Búsqueda por email
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Permisos", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")}),
        ("Fechas", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("email", "password1", "password2", "is_staff", "is_active"),
        }),
    )
    
    # Reemplazar el username por email en la administración
    add_form_template = None  # Eliminar formulario de username
    change_form_template = None  # Eliminar formulario de username

# Registrar usuario personalizado en Django Admin
admin.site.register(CustomUser, CustomUserAdmin)

# Configuración para Recetas
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("title", "user", "created_at", "updated_at")  # Columnas en la lista
    search_fields = ("title", "user__email")  # Buscar por título o email del usuario
    list_filter = ("created_at", "updated_at")  # Filtros por fecha

admin.site.register(Recipe, RecipeAdmin)

# Configuración para Recetas Generadas
class GeneratedRecipeAdmin(admin.ModelAdmin):
    list_display = ("title", "created_at")  # Mostrar nombre y fecha
    search_fields = ("title",)  # Buscar por título

admin.site.register(GeneratedRecipe, GeneratedRecipeAdmin)
