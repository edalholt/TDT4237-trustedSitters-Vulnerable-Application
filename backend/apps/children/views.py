from rest_framework import permissions, viewsets, generics, status
from .models import Child, ChildFile
from .serializers import ChildSerializer, ChildFilePostSerializer, ChildFileGetSerializer
from .permissions import IsParentOrReadOnly, ChildFilePermission
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import HttpResponse, HttpResponseNotFound
from django.core.exceptions import PermissionDenied
from django.contrib.auth import get_user_model
from rest_framework.response import Response
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
            response = HttpResponse(file.file, content_type=file.content_type)
            return response
        else:
            raise PermissionDenied(
                {"Message": "You do not have permission to access this file."})


class RemoveGuardianView(generics.GenericAPIView):
    def post(self, request):
        if request.data.get("child") and request.data.get("guardian"):
            childId = request.data["child"]
            guardian = request.data["guardian"]

            child = Child.objects.get(pk=childId)

            guardian = get_user_model().objects.get(username=guardian)

            if not (request.user == child.parent or request.user == guardian):
                return Response(status=status.HTTP_403_FORBIDDEN)

            child.guardians.remove(guardian)

            child.save()

            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST)
