
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField(write_only=True)

    new_password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    def validate(self, attrs):
        old_password = attrs.get("old_password")
        new_password = attrs.get("new_password")

        if old_password == new_password:
            raise serializers.ValidationError(
                "New password must be different from the old password."
            )

        user = self.context["request"].user

        try:
            validate_password(new_password, user=user)
        except DjangoValidationError as error:
            raise serializers.ValidationError({
                "new_password": error.messages
            })

        return attrs
