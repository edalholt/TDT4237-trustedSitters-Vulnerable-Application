from django.db.models import Q
from rest_framework import permissions, viewsets, generics, status
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import Offer, OfferStatus, OfferType
from apps.children.models import Child
from .serializers import OfferSerializer
from .permissions import IsSenderOrReceiver
from rest_framework.response import Response

# Create your views here.


class OfferViewSet(viewsets.ModelViewSet):

    serializer_class = OfferSerializer

    http_method_names = ['get', 'head', 'delete', 'post']

    permission_classes = [IsSenderOrReceiver]

    def perform_create(self, serializer):
        if self.request.data.get('recipient'):
            result = get_user_model().objects.raw(
                "SELECT * from users_user WHERE username = '%s'" % self.request.data['recipient'])

            if len(result) > 0:  # Check if a user exist with the given username
                r = ""
                for u in result:
                    r += u.username + " "
                serializer.save(
                    recipient=r.strip(), sender=self.request.user.username)
            else:
                raise ValidationError("User does not exist")
        else:
            raise ValidationError("Missing parameter: recipient")

    def get_queryset(self):
        queryset = Offer.objects.filter(
            Q(sender=self.request.user.username) | Q(recipient=self.request.user.username))

        return queryset


class AnswerOfferView(generics.GenericAPIView):

    def post(self, request):

        if request.data.get('offerId') and request.data.get('status'):

            offer = Offer.objects.get(id=request.data['offerId'])
            state = request.data['status']

            if offer.status != OfferStatus.PENDING:
                return Response({'success': False, 'message': 'Offer already answered'}, status=status.HTTP_400_BAD_REQUEST)

            if state == 'D':  # Declined offer
                offer.status = OfferStatus.DECLINED
                offer.save()
                return Response({'success': True, 'message': 'Offer declined'}, status=status.HTTP_200_OK)

            if state == 'A':  # Accepted offer
                offer.status = OfferStatus.ACCEPTED

                if offer.offerType == OfferType.GUARDIAN_OFFER:
                    parent = get_user_model().objects.get(username=offer.recipient)
                    children = Child.objects.filter(parent=parent)
                    sender = get_user_model().objects.get(username=offer.sender)

                    for child in children:
                        child.guardians.add(sender)
                        child.save()

                offer.save()
                return Response({'success': True, 'message': 'Offer accepted'}, status=status.HTTP_200_OK)

        return Response({'success': False, 'message': 'Missing offerId or invalid status'}, status=status.HTTP_400_BAD_REQUEST)
