from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from .forms import UserAdminCreationForm, UserAdminChangeForm
from .models import CustomUser

admin.site.unregister(Group)

class UserAdmin(BaseUserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    list_display = ['id', 'email', 'company', 'image', 'name', 'rating', 'get_skills', 'is_active', 'is_staff']
    list_filter = ['is_active', 'is_staff']
    fieldsets = (
        ('Account data', {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('company', 'image', 'name', 'rating')}),
        ('Permissions', {'fields': ('is_active', 'is_staff',)}),
    )

    def get_skills(self, obj):
        return "\n".join([p.skills for p in obj.skills.all()])

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password')}
        ),
    )
    search_fields = ['email']
    ordering = ['email']
    filter_horizontal = ()

admin.site.register(CustomUser, UserAdmin)
