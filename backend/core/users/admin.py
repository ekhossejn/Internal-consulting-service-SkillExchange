from django.contrib import admin
from users.models import Document, Request, Company, Skill, Review
# Register your models here.

admin.site.register(Document)
admin.site.register(Request)
admin.site.register(Company)
admin.site.register(Skill)
admin.site.register(Review)
