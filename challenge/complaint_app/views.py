from rest_framework import viewsets
from .models import UserProfile, Complaint
from .serializers import UserSerializer, UserProfileSerializer, ComplaintSerializer
from rest_framework.response import Response
from rest_framework import status
from django.db.models.functions import Substr, Length
from django.db.models import Count
from datetime import date
# Create your views here.

# rememger to refactor code to eliminate redundancy, e.g. retrieving all complaints for a district can be abstracted into a single function and called when necessary

class ComplaintViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  serializer_class = ComplaintSerializer
  def list(self, request):
    # Get all complaints from the user's district
    # assuming district numbers dont exceed 99

    # Get the user's district and normalize it
    council_member_dist_as_int = int(self.request.user.userprofile.district)

    if council_member_dist_as_int < 10:
      # Pad with 0 for single-digit districts to match format like 'NYCC07'
      council_member_dist_as_str = f'0{council_member_dist_as_int}'
      complaints = Complaint.objects.annotate(
        acct_dist_num=Substr('account', 5, Length('account') - 4)
      ).filter(acct_dist_num=council_member_dist_as_str)
    else:
      # No need to annotate if no zero-padding is needed 
      council_member_dist_as_str = str(council_member_dist_as_int)
      complaints = Complaint.objects.filter(account__endswith=council_member_dist_as_str)

    serializer = ComplaintSerializer(complaints, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class OpenCasesViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  def list(self, request):
    # Get only the open complaints from the user's district

    council_member_dist_as_int = int(self.request.user.userprofile.district)

    if council_member_dist_as_int < 10:
      council_member_dist_as_str = f'0{council_member_dist_as_int}'
      complaints = Complaint.objects.annotate(
        acct_dist_num=Substr('account', 5, Length('account') - 4)
      ).filter(acct_dist_num=council_member_dist_as_str)
    else:
      council_member_dist_as_str = str(council_member_dist_as_int)
      complaints = Complaint.objects.filter(account__endswith=council_member_dist_as_str)

    openComplaints = complaints.filter(closedate__isnull=True)
    serializer = ComplaintSerializer(openComplaints, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class ClosedCasesViewSet(viewsets.ModelViewSet):
  http_method_names = ['get'] 
  def list(self, request):
    # Get only complaints that are close from the user's district
    council_member_dist_as_int = int(self.request.user.userprofile.district)

    if council_member_dist_as_int < 10:
      council_member_dist_as_str = f'0{council_member_dist_as_int}'
      complaints = Complaint.objects.annotate(
        acct_dist_num=Substr('account', 5, Length('account') - 4)
      ).filter(acct_dist_num=council_member_dist_as_str)
    else:
      council_member_dist_as_str = str(council_member_dist_as_int)
      complaints = Complaint.objects.filter(account__endswith=council_member_dist_as_str)

    closedComplaints = complaints.filter(closedate__lte=date.today())
    serializer = ComplaintSerializer(closedComplaints, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)
    
class TopComplaintTypeViewSet(viewsets.ModelViewSet):
  http_method_names = ['get']
  def list(self, request):
    # Get the top 3 complaint types from the user's district
    council_member_dist_as_int = int(self.request.user.userprofile.district)

    if council_member_dist_as_int < 10:
      council_member_dist_as_str = f'0{council_member_dist_as_int}'
      complaints = Complaint.objects.annotate(
        acct_dist_num=Substr('account', 5, Length('account') - 4)
      ).filter(acct_dist_num=council_member_dist_as_str)
    else:
      council_member_dist_as_str = str(council_member_dist_as_int)
      complaints = Complaint.objects.filter(account__endswith=council_member_dist_as_str)

    topThreeComplaints = complaints.values('complaint_type').annotate(totalComplaints=Count('id')).order_by('-totalComplaints')[:3]
    serializer = ComplaintSerializer(topThreeComplaints, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)