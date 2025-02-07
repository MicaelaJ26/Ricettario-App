from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)  # Permite acceso al admin
    date_joined = models.DateTimeField(auto_now_add=True)
    first_name = models.CharField(max_length=30, blank=True, null=True)  # Opcional
    last_name = models.CharField(max_length=30, blank=True, null=True)  # Opcional
    objects = CustomUserManager()

    USERNAME_FIELD = "email"  # Se usa el email en lugar del username
    REQUIRED_FIELDS = ['first_name', 'last_name']  

    def __str__(self):
        return self.email
    
    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"


class Recipe(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)  # Quién creó la receta
    title = models.CharField(max_length=255)  # Nombre de la receta
    description = models.TextField()  # Breve descripción
    ingredients = models.JSONField(default=list)  # Lista de ingredientes en texto
    steps = models.JSONField(default=list)  # Pasos en texto
    image = models.ImageField(upload_to='recipes/', blank=True, null=True)  # Imagen opcional
    created_at = models.DateTimeField(auto_now_add=True)  # Cuándo se creó
    updated_at = models.DateTimeField(auto_now=True)  # Última modificación

    def __str__(self):
        return self.title
    
class GeneratedRecipe(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    title = models.CharField(max_length=255)  # Nombre de la receta generada
    ingredients = models.JSONField(default=list)  # Lista generada de ingredientes
    steps = models.JSONField(default=list)  # Pasos generados
    created_at = models.DateTimeField(auto_now_add=True)  # Fecha de creación

    def __str__(self):
        return f"Mix It Up: {self.title}"
