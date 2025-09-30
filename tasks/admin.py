from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_by', 'is_completed', 'created_at', 'updated_at')
    list_filter = ('is_completed', 'created_at', 'updated_at', 'created_by')
    search_fields = ('title', 'description')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('is_completed',)
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        # Allow admins to see all tasks, regular users only see their own
        if request.user.is_superuser or request.user.role == 'admin':
            return qs
        return qs.filter(created_by=request.user)