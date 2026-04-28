from rest_framework.routers import DefaultRouter

from operations.views import DebtViewSet, TransactionViewSet

router = DefaultRouter()
router.register("transactions", TransactionViewSet, basename="transaction")
router.register("debts", DebtViewSet, basename="debt")

urlpatterns = router.urls
