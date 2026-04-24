from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Page
import json

@csrf_exempt # Only for development; use proper CSRF tokens in production
def save_puck_data(request, page_id):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Find the page and update its 'content' JSONField
            page = Page.objects.get(id=page_id)
            page.content = data
            page.save()
            return JsonResponse({"status": "success"})
        except Page.DoesNotExist:
            return JsonResponse({"error": "Page not found"}, status=404)
    
    return JsonResponse({"error": "Invalid request"}, status=400)

def get_puck_data(request, page_id):
    try:
        page = Page.objects.get(id=page_id)
        return JsonResponse(page.content)
    except Page.DoesNotExist:
        return JsonResponse({}, status=404)
