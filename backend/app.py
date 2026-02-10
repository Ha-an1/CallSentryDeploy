from flask import Flask, request, jsonify
from flask_cors import CORS
from convo import chatbot, detect_fraud

app = Flask(__name__)

print(">>> Flask app starting <<<", flush=True)

CORS(app)

@app.route("/", methods=["GET", "OPTIONS"])
def root():
    return jsonify({"status": "ok"}), 200

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/chat", methods=["POST", "OPTIONS"], provide_automatic_options=False)
def chat():
    # ✅ Explicitly handle CORS preflight
    if request.method == "OPTIONS":
        return "", 200

    # ✅ Only POST reaches here
    data = request.get_json(force=True)

    if "message" not in data:
        return jsonify({"error": "Invalid request"}), 400

    user_message = data["message"]
    conversation_id = data.get("conversation_id")

    fraud_result = detect_fraud(user_message)

    if fraud_result["fraud_confidence"] >= 0.85:
        return jsonify({
            "response": "Conversation terminated due to high fraud risk.",
            "fraud_confidence": fraud_result["fraud_confidence"],
            "terminated": True
        })

    response = chatbot(
        user_message,
        conversation_id=conversation_id,
        fraud_context=fraud_result
    )

    return jsonify({
        "response": response,
        "fraud_confidence": fraud_result["fraud_confidence"],
        "terminated": False
    })


if __name__ == "__main__":
    print(">>> Running directly <<<", flush=True)
    app.run(host="0.0.0.0", port=5000)
