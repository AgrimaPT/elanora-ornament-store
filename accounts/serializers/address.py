from rest_framework import serializers

from accounts.models import Address


class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = [
            "id",
            "full_name",
            "phone_number",
            "address_line_1",
            "address_line_2",
            "city",
            "state",
            "pincode",
            "is_default",
        ]

    def create(self, validated_data):

        user = self.context["request"].user

        is_default = validated_data.get(
            "is_default",
            False
        )

        if is_default:

            Address.objects.filter(
                user=user,
                is_default=True,
            ).update(
                is_default=False
            )

        return Address.objects.create(
            user=user,
            **validated_data
        )

    def update(self, instance, validated_data):

        is_default = validated_data.get(
            "is_default",
            instance.is_default
        )

        if is_default:

            Address.objects.filter(
                user=instance.user,
                is_default=True,
            ).exclude(
                id=instance.id
            ).update(
                is_default=False
            )

        return super().update(
            instance,
            validated_data
        )