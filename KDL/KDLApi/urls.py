from rest_framework.routers import DefaultRouter
from .views import (
    SystemViewSet, OrganViewSet, StateViewSet, ParameterViewSet,
    GenderViewSet, POTCViewSet, TODViewSet, DeviationViewSet, DynamicsViewSet,
    PriorityViewSet, WeightViewSet, RecViewSet, DOSViewSet
)

router = DefaultRouter()

# Глоссарии
router.register(r'system', SystemViewSet)
router.register(r'organ', OrganViewSet)
router.register(r'state', StateViewSet)
router.register(r'parameter', ParameterViewSet)
router.register(r'gender', GenderViewSet)
router.register(r'potc', POTCViewSet)
router.register(r'tod', TODViewSet)
router.register(r'deviation', DeviationViewSet)
router.register(r'dynamics', DynamicsViewSet)
router.register(r'priority', PriorityViewSet)
router.register(r'weight', WeightViewSet)
router.register(r'rec', RecViewSet)

# Сводная таблица
router.register(r'dos', DOSViewSet)

urlpatterns = router.urls