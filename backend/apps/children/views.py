from rest_framework import permissions, viewsets, generics
from .models import Child, ChildFile
from .serializers import ChildSerializer, ChildFilePostSerializer, ChildFileGetSerializer
from .permissions import IsParentOrReadOnly, ChildFilePermission
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse, HttpResponseNotFound
from django.core.exceptions import PermissionDenied
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


class ChildFileDownloadView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            file = ChildFile.objects.get(pk=pk)
        except:
            return HttpResponseNotFound('<h1>File not found :(</h1>')
        user = request.user
        parent = file.child.parent
        guardians = file.child.guardians.all()

        if (user == parent or user in guardians):
            Response = HttpResponse(file.file, content_type=file.content_type)
            return Response
        else:
            raise PermissionDenied(
                {"Message": "You do not have permission to access this file."})
