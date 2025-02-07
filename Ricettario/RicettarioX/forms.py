from django import forms
from django.contrib.auth import get_user_model
from .models import Recipe, GeneratedRecipe
from django.contrib.auth.forms import AuthenticationForm


class CustomAuthenticationForm(AuthenticationForm):
    username = forms.EmailField(label='Correo electrónico')  # Usamos Email en lugar de username

# Formulario para el registro de usuarios
class UserRegisterForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput())
    password_confirm = forms.CharField(widget=forms.PasswordInput())
    first_name = forms.CharField(max_length=50, required=True)
    last_name = forms.CharField(max_length=50, required=True)
    class Meta:
        model = get_user_model()  # Usamos el modelo de usuario personalizado
        fields = ['email', 'first_name', 'last_name'] 
        
    def clean_password_confirm(self):
        password = self.cleaned_data.get('password')
        password_confirm = self.cleaned_data.get('password_confirm')

        if password != password_confirm:
            raise forms.ValidationError("Las contraseñas no coinciden")
        return password_confirm

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if get_user_model().objects.filter(email=email).exists():
            raise forms.ValidationError("Ya existe un usuario con ese correo electrónico.")
        return email


# Formulario para crear recetas
class RecipeForm(forms.ModelForm):
    class Meta:
        model = Recipe
        fields = ['title', 'description', 'ingredients', 'steps', 'image']  # Campos del modelo

    ingredients = forms.CharField(widget=forms.Textarea(attrs={'placeholder': 'Ingresa los ingredientes separados por coma'}))
    steps = forms.CharField(widget=forms.Textarea(attrs={'placeholder': 'Escribe los pasos de la receta'}))

class GeneratedRecipeForm(forms.ModelForm):
    class Meta:
        model = GeneratedRecipe
        fields = ['title', 'ingredients', 'steps']

class RecipeSearchForm(forms.Form):
    query = forms.CharField(max_length=255, required=False, label='Buscar receta')
