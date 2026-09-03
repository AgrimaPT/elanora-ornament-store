from rest_framework import serializers


class ProductFilterSerializer(serializers.Serializer):

    search = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    category = serializers.CharField(
        required=False,
        allow_blank=True,
    )

    featured = serializers.BooleanField(
        required=False,
    )

    min_price = serializers.DecimalField(
        required=False,
        min_value=0,
        max_digits=10,
        decimal_places=2,
    )

    max_price = serializers.DecimalField(
        required=False,
        min_value=0,
        max_digits=10,
        decimal_places=2,
    )

    ordering = serializers.ChoiceField(
        required=False,
        choices=[
            "price",
            "-price",
            "name",
            "-name",
        ],
    )

    def validate(self, attrs):

        min_price = attrs.get("min_price")
        max_price = attrs.get("max_price")

        if (
            min_price is not None
            and max_price is not None
            and min_price > max_price
        ):
            raise serializers.ValidationError(
                "min_price cannot be greater than max_price."
            )

        return attrs