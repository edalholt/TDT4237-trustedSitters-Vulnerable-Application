from rest_framework import permissions, viewsets
from .models import Child
from .serializers import ChildSerializer
from .permissions import IsParentOrReadOnly
# Create your views here.


class ChildViewSet(viewsets.ModelViewSet):
    queryset = Child.objects.raw('SELECT * FROM children_child')
    serializer_class = ChildSerializer
    permission_classes = [IsParentOrReadOnly, ]

    def perform_create(self, serializer):
        serializer.save(parent=self.request.user)
