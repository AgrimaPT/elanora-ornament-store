
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_spectacular.utils import extend_schema

from ai.gemini_service import chat_with_catalogue


class AIChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField()


class AIChatResponseSerializer(serializers.Serializer):
    response = serializers.CharField()
    products = serializers.ListField(
        child=serializers.DictField(),
        required=False,
    )


class AIChatAPIView(APIView):

    @extend_schema(
        request=AIChatRequestSerializer,
        responses={200: AIChatResponseSerializer},
        description="Chat with the ELANORA AI shopping assistant.",
    )
    def post(self, request):
        message = request.data.get("message")

        if not message:
            return Response(
                {"error": "Message is required."},
                status=400,
            )

        previous_interaction_id = request.session.get(
            "ai_interaction_id"
        )

        result = chat_with_catalogue(
            message,
            previous_interaction_id=previous_interaction_id,
        )

        request.session["ai_interaction_id"] = result[
            "interaction_id"
        ]

        return Response(
            {
                "response": result["response"],
                "products": result.get("products", []),
            }
        )
