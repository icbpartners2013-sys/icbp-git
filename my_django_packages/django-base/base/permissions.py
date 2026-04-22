from rest_framework import permissions

class IsStaffUser(permissions.BasePermission):
    """
    Allows access only to staff users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'user_type', '') == 'STAFF')

class IsClientUser(permissions.BasePermission):
    """
    Allows access only to client users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and getattr(request.user, 'user_type', '') == 'CLIENT')

class IsStaffOrClientReadOnly(permissions.BasePermission):
    """
    Staff can edit, Clients can only read.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if getattr(request.user, 'user_type', '') == 'STAFF':
            return True
        if getattr(request.user, 'user_type', '') == 'CLIENT' and request.method in permissions.SAFE_METHODS:
            return True
        return False

class IsOwnerOrStaff(permissions.BasePermission):
    """
    Clients can only access their own objects. Staff can access all.
    Assumes the model has a `client` or `user` field, or the object IS the user.
    """
    def has_object_permission(self, request, view, obj):
        if getattr(request.user, 'user_type', '') == 'STAFF':
            return True
        
        # If the object is the User itself
        if hasattr(obj, 'user_type'):
            return obj == request.user
            
        # If the object has a client field
        if hasattr(obj, 'client'):
            return obj.client == request.user
            
        return False
