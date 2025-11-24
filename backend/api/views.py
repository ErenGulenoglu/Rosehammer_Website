import os
from django.conf import settings
from django.http import FileResponse, Http404
from .models import DownloadLog

# Create your views here.
def download_file(request, filename):
    # Path to your files (put files in settings.MEDIA_ROOT or another folder)
    file_path = os.path.join(settings.MEDIA_ROOT, filename)

    if not os.path.exists(file_path):
        raise Http404("File not found")

    # Log the download
    DownloadLog.objects.create(
        file_name=filename,
        ip_address=get_client_ip(request),
        user_agent=request.META.get('HTTP_USER_AGENT', '')
    )

    # Return the file as an attachment (forces download)
    return FileResponse(open(file_path, "rb"), as_attachment=True, filename=filename)


def get_client_ip(request):
    """Helper to extract IP address."""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0]
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip