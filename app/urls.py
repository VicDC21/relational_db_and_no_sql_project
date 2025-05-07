"""
URL configuration for proyecto project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from app import views
from django.views.generic import TemplateView
from django.urls import path
from . import views

urlpatterns = [
    path('', TemplateView.as_view(template_name='app/index.html'), name='index'),
    path('', views.index, name='index'),
    path('api/datos/', views.obtener_datos, name='obtener_datos'),  
    path('api/datos/<int:pk>/', views.obtener_producto, name='obtener_producto'),  
    path('api/datos/nuevo/', views.crear_producto, name='crear_producto'),  
    path('api/datos/<int:pk>/editar/', views.actualizar_producto, name='actualizar_producto'),  
    path('api/datos/<int:pk>/eliminar/', views.eliminar_producto, name='eliminar_producto'),  
    path('api/nosql/datos/', views.obtener_datos_nosql, name='obtener_datos_nosql'),
    path('api/nosql/datos/<int:pk>/', views.obtener_producto_nosql, name='obtener_producto_nosql'),
    path('api/nosql/datos/nuevo/', views.crear_producto_nosql, name='crear_producto_nosql'),  
    path('api/nosql/datos/<str:pk>/editar/', views.actualizar_producto_nosql, name='actualizar_producto_nosql'),
    path('api/nosql/datos/<str:pk>/eliminar/', views.eliminar_producto_nosql, name='eliminar_producto_nosql'),
]