from django.contrib.auth.hashers import check_password
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from factoryforge.permissions.permissions import ReadOnly
from .models import CustomUser
from .serializers import UserSerializer
from .permissions import IsOwnerOrReadOnly


# Get all users
class UserListCreateUserView(ListCreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def get_queryset(self):
        search = self.request.query_params.get('search')
        if search:
            return CustomUser.objects.filter(first_name__icontains=search)
        return CustomUser.objects.all()


class ClientsListCreateView(ListCreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def get_queryset(self):
        queryset = CustomUser.objects.filter(type_of_user='C')
        return queryset


# Get single user by id
class UserSingleView(RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated | ReadOnly]


# Get logged in user (me)
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated | ReadOnly]

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Patch logged in user (me)
class CurrentUserUpdateView(UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated | ReadOnly]

    def get_object(self):
        return self.request.user

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = UserSerializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data, status=status.HTTP_200_OK)


# Delete and patch by id
# Authorization added, can only patch and delete own user profile
class RetrieveUpdateDeleteUserView(RetrieveUpdateDestroyAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated | ReadOnly]


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user = request.user
        new_password = request.data.get("new_password")
        current_password = request.data.get("current_password")

        if not current_password or not new_password:
            return Response({'error': 'Current or new password not provided'}, status=status.HTTP_400_BAD_REQUEST)

        if not check_password(current_password, user.password):
            return Response({'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully'}, status=status.HTTP_200_OK)
