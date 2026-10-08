from rest_framework.response import Response
from rest_framework.views import APIView

from ai.gemini_service import chat_with_catalogue


class AIChatAPIView(APIView):

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