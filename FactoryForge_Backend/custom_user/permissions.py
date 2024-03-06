from rest_framework import permissions


#Custom permission to only allow owners of an object to edit it.
class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):

        # Read permissions are allowed to any request.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed if the user is the owner of the object.
        has_access = obj == request.user
        return has_access