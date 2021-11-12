from rest_framework import permissions, viewsets
from .models import Child, ChildFile
from .serializers import ChildSerializer, ChildFilePostSerializer, ChildFileGetSerializer
from .permissions import IsParentOrReadOnly, ChildFilePermission
from rest_framework.parsers import MultiPartParser, FormParser
# Create your views here.


class ChildViewSet(viewsets.ModelViewSet):
    queryset = Child.objects.all()
    serializer_class = ChildSerializer
    permission_classes = [IsParentOrReadOnly, ]

    def perform_create(self, serializer):
        serializer.save(parent=self.request.user)


class ChildFileViewSet(viewsets.ModelViewSet):

    queryset = ChildFile.objects.all()

    permission_classes = [ChildFilePermission]
    parser_classes = [MultiPartParser, FormParser]

    http_method_names = ['get', 'head', 'post', 'delete']

    def get_serializer_class(self):
        if self.action == 'create':
            return ChildFilePostSerializer

        return ChildFileGetSerializer

    def perform_create(self, serializer):
        serializer.save(
            content_type=self.request.data.get('file').content_type)
