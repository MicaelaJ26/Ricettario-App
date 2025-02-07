from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),  # Ruta del panel de administración de Django
    path('api/', include('RicettarioX.urls')),  # Incluye las URLs de la app RicettarioX
]
