from rest_framework.routers import DefaultRouter
from .views import ToyViewSet

router = DefaultRouter()

router.register('api/toys', ToyViewSet, basename='toys')

urlpatterns = [*router.urls]
