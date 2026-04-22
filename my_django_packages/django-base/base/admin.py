from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Tenant, User, Service, ClientService, TimeEntry, Document, Message

class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('tenant', 'user_type', 'staff_role', 'staff_title', 'client_type', 'client_subtype')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'user_type', 'staff_role', 'client_type')

admin.site.register(Tenant)
admin.site.register(User, CustomUserAdmin)
admin.site.register(Service)
admin.site.register(ClientService)
admin.site.register(TimeEntry)
admin.site.register(Document)
admin.site.register(Message)
