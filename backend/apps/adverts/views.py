from rest_framework import permissions, viewsets
from .models import Advert, AdvertType
from .serializers import AdvertSerializer
from .permissions import IsOwnerOrReadOnly


class NeedSitterAdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.filter(advertType=AdvertType.NEED_SITTER)

    serializer_class = AdvertSerializer
    permission_classes = [IsOwnerOrReadOnly &
                          permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user,
                        advertType=AdvertType.NEED_SITTER)


class IsSitterAdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.filter(advertType=AdvertType.IS_SITTER)

    serializer_class = AdvertSerializer

    permission_classes = [IsOwnerOrReadOnly &
                          permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user,
                        advertType=AdvertType.IS_SITTER)

# ViewSet for getting all the Adverts


class AdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.all()
    serializer_class = AdvertSerializer
    http_method_names = ['get', 'head', 'patch']
    permission_classes = [IsOwnerOrReadOnly &
                          permissions.IsAuthenticated]
