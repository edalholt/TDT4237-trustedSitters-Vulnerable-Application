from rest_framework.routers import DefaultRouter
from apps.children import views

router = DefaultRouter()

router.register('api/children',
                views.ChildViewSet, basename='children')


urlpatterns = [*router.urls]
