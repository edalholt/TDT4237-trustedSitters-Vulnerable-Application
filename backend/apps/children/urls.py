from rest_framework.routers import DefaultRouter
from apps.children import views

router = DefaultRouter()

router.register('api/children',
                views.ChildViewSet, basename='children')
router.register('api/child-file', views.ChildFileViewSet,
                basename='child-file')

urlpatterns = [*router.urls]
