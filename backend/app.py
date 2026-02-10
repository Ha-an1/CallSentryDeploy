from flask import Flask, request, jsonify
from flask_cors import CORS
from convo import chatbot, detect_fraud

app = Flask(__name__)

CORS(app, resources={r"/chat": {"origins": "*"}})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/chat", methods=["POST"])
def chat():
    print("[CHAT] Request received")

    data = request.get_json(silent=True)
    print("[CHAT] Payload:", data)

    if not data or "message" not in data:
        print("[CHAT] Invalid payload")
        return jsonify({"error": "Invalid request"}), 400

    user_message = data["message"]
    conversation_id = data.get("conversation_id")

    print("[CHAT] Running fraud detection...")
    fraud_result = detect_fraud(user_message)
    print("[CHAT] Fraud result:", fraud_result)

    if fraud_result["fraud_confidence"] >= 0.85:
        print("[CHAT] Terminating due to fraud")
        return jsonify({
            "response": "Conversation terminated due to high fraud risk.",
            "fraud_confidence": fraud_result["fraud_confidence"],
            "terminated": True
        }), 200

    print("[CHAT] Calling chatbot (Gemini)...")
    response = chatbot(
        user_message,
        conversation_id=conversation_id,
        fraud_context=fraud_result
    )
    print("[CHAT] Gemini responded")

    return jsonify({
        "response": response,
        "fraud_confidence": fraud_result["fraud_confidence"],
        "terminated": False
    }), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
