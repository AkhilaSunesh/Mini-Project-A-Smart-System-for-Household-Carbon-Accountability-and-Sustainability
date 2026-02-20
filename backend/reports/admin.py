from django.contrib import admin
from django.utils.html import format_html
from .models import EcoActionSubmission


@admin.register(EcoActionSubmission)
class EcoActionSubmissionAdmin(admin.ModelAdmin):

    list_display = (
        'title',
        'user',
        'status',
        'points',
        'submitted_at',
        'reviewed_at',
        'proof_preview',
    )

    list_filter = ('status', 'submitted_at')
    search_fields = ('title', 'user__username')
    readonly_fields = ('submitted_at', 'reviewed_at', 'proof_preview')

    def get_fieldsets(self, request, obj=None):

        if obj is None:
            # When creating new submission (simulate user upload)
            return (
                ('Submission Details', {
                    'fields': ('user', 'title', 'category', 'description', 'proof_image')
                }),
            )
        else:
            # When editing (admin reviewing)
            return (
                ('Submission Details', {
                    'fields': ('user', 'title', 'category', 'description')
                }),
                ('Proof', {
                    'fields': ('proof_image', 'proof_preview')
                }),
                ('Review Section', {
                    'fields': ('status', 'points', 'submitted_at', 'reviewed_at')
                }),
            )

    def proof_preview(self, obj):
        if obj.proof_image:
            return format_html(
                '<img src="{}" width="150" style="border-radius:5px;" />',
                obj.proof_image.url
            )
        return "No Image"

    proof_preview.short_description = "Proof Preview"