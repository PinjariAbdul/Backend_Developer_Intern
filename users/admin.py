from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'get_role_display', 'is_staff', 'is_active', 'is_superuser')
    list_filter = ('role', 'is_staff', 'is_active', 'is_superuser')
    
    # Add role field to the fieldsets
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
        ('Additional Info', {'fields': ('role',)}),
    )
    
    # Add role field to the add_fieldsets
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2', 'role')}
        ),
    )
    
    @admin.display(description='Role', ordering='role')
    def get_role_display(self, obj):
        # If user is superuser, show 'Admin' to make it clear
        if obj.is_superuser:
            return 'Admin'
        return obj.get_role_display()
    
    def save_model(self, request, obj, form, change):
        # If user is being made superuser, automatically set role to admin
        if obj.is_superuser:
            obj.role = 'admin'
        super().save_model(request, obj, form, change)

# Register the User model with the custom admin class
admin.site.register(User, CustomUserAdmin)