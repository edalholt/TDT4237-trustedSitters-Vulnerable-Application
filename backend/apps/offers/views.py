from django.db.models import Q
from rest_framework import permissions, viewsets, generics, status
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from .models import Offer, OfferStatus, OfferType, Contract
from apps.children.models import Child
from apps.adverts.models import Advert, AdvertType
from .serializers import OfferSerializer, ContractSerializer
from .permissions import IsSenderOrReceiver
from rest_framework.response import Response
import pickle
import base64
# Create your views here.


class OfferViewSet(viewsets.ModelViewSet):

    serializer_class = OfferSerializer

    http_method_names = ['get', 'head', 'delete', 'post']

    permission_classes = [IsSenderOrReceiver]

    def perform_create(self, serializer):
        if self.request.data.get('recipient'):
            #Vulnerable to SQL injection, user has direct access to application SQL - Eivind
            #Tested with input (hei' OR 1=1--) wich returned all usernames in database.
            result = get_user_model().objects.raw(
                "SELECT * from users_user WHERE username = '%s'" % self.request.data['recipient'])

            if self.request.user.username == self.request.data['recipient'].strip():
                raise ValidationError("Cannot send offer to yourself")

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


class ContractViewSet(viewsets.ModelViewSet):

    serializer_class = ContractSerializer

    http_method_names = ['get', 'head']

    def get_queryset(self):
        queryset = Contract.objects.filter(
            Q(parent=self.request.user) | Q(sitter=self.request.user))

        return queryset


class FinishContractView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.data.get('contractId'):
            cId = base64.b64decode(request.data.get('contractId'))
            cId = pickle.loads(cId)
            contract = Contract.objects.get(id=cId)
            if request.user == contract.parent:
                contract.finished = True
                contract.save()
                return Response({'success': True, 'message': 'Contract finished'}, status=status.HTTP_200_OK)

        return Response({'success': False, 'message': 'Only parents can mark the contract as finished.'}, status=status.HTTP_400_BAD_REQUEST)


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
                if offer.offerType == OfferType.JOB_OFFER:
                    ad = offer.advert  # Advert.objects.get(offer.advert)
                    if ad.advertType == AdvertType.IS_SITTER:
                        parent = get_user_model().objects.get(username=offer.sender)
                        sitter = get_user_model().objects.get(username=offer.recipient)

                    if ad.advertType == AdvertType.NEED_SITTER:
                        parent = get_user_model().objects.get(username=offer.recipient)
                        sitter = get_user_model().objects.get(username=offer.sender)

                    contract = Contract(
                        parent=parent, sitter=sitter, date=ad.date, start_time=ad.start_time, end_time=ad.end_time, content=ad.content)
                    ad.save()
                    contract.save()

                offer.save()
                return Response({'success': True, 'message': 'Offer accepted'}, status=status.HTTP_200_OK)

        return Response({'success': False, 'message': 'Missing offerId or invalid status'}, status=status.HTTP_400_BAD_REQUEST)
