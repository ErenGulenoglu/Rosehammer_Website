from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from django.utils.translation import gettext_lazy as _

# Register your models here.
class UserAdmin(BaseUserAdmin):
    # Fields to display in the admin list view
    list_display = ('email', "first_name", "last_name", 'is_staff', 'is_active', 'date_joined', 'last_login') # 'first_name', 'last_name',
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')

    # Make non-editable fields readonly
    readonly_fields = ('date_joined', 'last_login')

    # Fieldsets for edit view
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ("first_name", "last_name", 'address', 'phone_number')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
    )

    # Fields for adding a new user in admin
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', "first_name", "last_name", 'password1', 'password2'),
        }),
    )

    search_fields = ('email','first_name', 'last_name')
    ordering = ('email',)
    filter_horizontal = ('groups', 'user_permissions',)

# Register the custom user model
admin.site.register(User, UserAdmin)