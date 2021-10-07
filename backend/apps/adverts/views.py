from rest_framework import permissions, viewsets
from .models import Advert, AdvertType
from .serializers import AdvertSerializer
from .permissions import IsOwnerOrReadOnly


class NeedSitterAdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.filter(advertType=AdvertType.NEED_SITTER)

    serializer_class = AdvertSerializer

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user,
                        advertType=AdvertType.NEED_SITTER)

    def get_permissions(self):

        if self.action in ['list', 'create', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwnerOrReadOnly &
                                  permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]


class IsSitterAdvertViewSet(viewsets.ModelViewSet):
    queryset = Advert.objects.filter(advertType=AdvertType.IS_SITTER)

    serializer_class = AdvertSerializer

    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user,
                        advertType=AdvertType.IS_SITTER)

    def get_permissions(self):

        if self.action in ['list', 'create', 'retrieve']:
            permission_classes = [permissions.IsAuthenticated]
        else:
            permission_classes = [IsOwnerOrReadOnly &
                                  permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
