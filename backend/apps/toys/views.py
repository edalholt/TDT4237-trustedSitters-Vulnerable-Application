
# Create your views here.
from .serializers import ToySerializer
from .models import Toy
from rest_framework import viewsets


class ToyViewSet(viewsets.ModelViewSet):

    queryset = Toy.objects.all()
    serializer_class = ToySerializer
    # permission_classes = [ ]
