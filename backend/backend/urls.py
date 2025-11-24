from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('frozenThrone/', admin.site.urls),
    path('api/', include('api.urls')),
    path('users/', include('users.urls')),
    path('shop/', include('shop.urls')),
]

if settings.DEBUG: # In production, upload your media files to proper file host or CDN (AWS S3, etc.)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)