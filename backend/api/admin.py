from django.contrib import admin
from .models import DownloadLog

# Register your models here.
@admin.register(DownloadLog)
class DownloadLogAdmin(admin.ModelAdmin):
    list_display = ("file_name", "ip_address", "timestamp")
    list_filter = ("file_name", "timestamp")