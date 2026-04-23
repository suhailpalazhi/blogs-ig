from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        # Allow read access to everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write access only to authenticated users
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Allow read access to everyone
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write/delete only for author
        return request.user and request.user.is_authenticated and obj.author == request.user
