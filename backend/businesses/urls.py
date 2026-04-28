from rest_framework.routers import DefaultRouter

from businesses.views import BusinessViewSet

router = DefaultRouter()
router.register("businesses", BusinessViewSet, basename="business")

urlpatterns = router.urls
