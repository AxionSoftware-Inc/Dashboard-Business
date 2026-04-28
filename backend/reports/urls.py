from django.urls import path

from reports.views import dashboard_summary

urlpatterns = [
    path("dashboard/summary/", dashboard_summary, name="dashboard-summary"),
]
