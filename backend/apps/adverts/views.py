from rest_framework import generics
from .models import Advert, AdvertType
from .serializers import AdvertSerializer


class NeedSitterAdvertView(generics.ListCreateAPIView):
    queryset = Advert.objects.filter(advertType=AdvertType.NEED_SITTER)

    serializer_class = AdvertSerializer

    permission_classes = []

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class IsSitterAdvertView(generics.ListCreateAPIView):
    queryset = Advert.objects.filter(advertType=AdvertType.IS_SITTER)

    serializer_class = AdvertSerializer

    permission_classes = []

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
