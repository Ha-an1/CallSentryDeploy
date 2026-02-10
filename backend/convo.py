import os
import re
import threading
import torch
from dotenv import load_dotenv
from transformers import AutoModelForSequenceClassification, AutoTokenizer
from google import genai
from google.genai import types
import torch.nn.functional as F 

# =========================================================
# 🔒 ENV + SAFETY SETTINGS
# =========================================================
os.environ["TRANSFORMERS_OFFLINE"] = "1"
os.environ["HF_HUB_DISABLE_TELEMETRY"] = "1"

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

print("[INFO] Starting system...")

# =========================================================
# 🖥️ DEVICE SETUP
# =========================================================
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"[INFO] Using device: {DEVICE}")

# =========================================================
# 🤖 GEMINI CLIENT
# =========================================================
try:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
    print("[INFO] Gemini client initialized")
except Exception as e:
    print(f"[ERROR] Gemini init failed: {e}")
    gemini_client = None

# =========================================================
# 🛡️ FRAUD MODEL LOADING
# =========================================================
FRAUD_MODEL_PATH = "fine_tuned_fraud_model"

print("[INFO] Loading fraud tokenizer...")
fraud_tokenizer = AutoTokenizer.from_pretrained(FRAUD_MODEL_PATH)

print("[INFO] Loading fraud model...")
fraud_model = AutoModelForSequenceClassification.from_pretrained(FRAUD_MODEL_PATH)
fraud_model.to(DEVICE)
fraud_model.eval()

print("[INFO] Fraud model loaded successfully")

# =========================================================
# 🧠 SESSION + MEMORY
# =========================================================
session_data = {
    "caller_name": None,
    "caller_affiliation": None,
}

conversation_history = []

# =========================================================
# 🔍 INFO EXTRACTION
# =========================================================
def extract_name_and_affiliation(text):
    patterns = [
        r"(?:my name is|this is|it's|i am|i'm) (\w+)(?: from| with| at| of)? (.+)?",
        r"(\w+) here,? calling from (.+)",
    ]

    for p in patterns:
        match = re.search(p, text, re.IGNORECASE)
        if match:
            return match.group(1), match.group(2)
    return None, None

# =========================================================
# FRAUD DETECTION
# =========================================================
def detect_fraud(text, threshold=0.7):
    inputs = fraud_tokenizer(
        text,
        return_tensors="pt",
        padding=True,
        truncation=True
    )
    inputs = {k: v.to(DEVICE) for k, v in inputs.items()}

    with torch.no_grad():
        outputs = fraud_model(**inputs)
        probs = F.softmax(outputs.logits, dim=1)

    fraud_confidence = probs[0][1].item()
    is_fraud = fraud_confidence >= threshold

    return {
        "is_fraud": is_fraud,
        "fraud_confidence": fraud_confidence
    }
# =========================================================
# GEMINI CALL
# =========================================================
def call_gemini(prompt):
    if gemini_client is None:
        return "System error: Gemini unavailable."

    system_prompt = (
        "You are an AI call assistant answering on behalf of a user named Jacob. "
        "Always introduce yourself as an AI call assistant. "
        "If the caller claims to be a friend, colleague, or family member, "
        "politely place the call on hold and alert the user. "
        "When the caller refers to 'you', they mean the user you represent."
    )

    if session_data.get("caution_mode"):
        system_prompt += (
            " The conversation has been flagged as potentially suspicious. "
            "Be cautious, avoid sharing information, "
            "and steer the conversation toward verification or termination."
        )
    if session_data["caller_name"] and session_data["caller_affiliation"]:
        system_prompt += (
            f" The caller's name is {session_data['caller_name']} "
            f"from {session_data['caller_affiliation']}. "
            "Do not ask for this information again."
        )

    gemini_history = []

    for msg in conversation_history:
        role = "model" if msg["role"] == "assistant" else "user"
        gemini_history.append(
            types.Content(
                role=role,
                parts=[types.Part.from_text(text=msg["content"])]
            )
        )

    gemini_history.append(
        types.Content(
            role="user",
            parts=[types.Part.from_text(text=prompt)]
        )
    )

    config = types.GenerateContentConfig(
        system_instruction=system_prompt,
        temperature=0.7,
    )

    try:
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=gemini_history,
            config=config,
        )
        reply = response.text
    except Exception as e:
        print(f"[ERROR] Gemini call failed: {e}")
        reply = "I'm currently unable to continue this call."

    if reply:
        conversation_history.append({"role": "user", "content": prompt})
        conversation_history.append({"role": "assistant", "content": reply})

    return reply


# =========================================================
# ⏱️ TIMEOUT WRAPPER
# =========================================================
def call_gemini_with_timeout(prompt, timeout=10):
    result = {}

    def task():
        result["text"] = call_gemini(prompt)

    t = threading.Thread(target=task)
    t.start()
    t.join(timeout)

    if t.is_alive():
        return "The assistant is temporarily unavailable. Please try again."

    return result.get("text", "")

# =========================================================
# 💬 MAIN CHAT HANDLER
# =========================================================
session_data = {
    "caller_name": None,
    "caller_affiliation": None,
    "caution_mode": False,
}

def chatbot(user_input, conversation_id=None, fraud_context=None):
    name, affiliation = extract_name_and_affiliation(user_input)
    if name and affiliation:
        session_data["caller_name"] = name
        session_data["caller_affiliation"] = affiliation

    if fraud_context:
        if fraud_context["fraud_confidence"] >= 0.5:
            session_data["caution_mode"] = True

    return call_gemini_with_timeout(user_input)

# =========================================================
# ▶️ RUN LOOP
# =========================================================
if __name__=="__main__":
    print("\n[READY] System initialized. Type 'bye' to quit.\n")

    while True:
        user_input = input("> ")
        if user_input.lower() == "bye":
            print("[INFO] Session ended.")
            break

        response = chatbot(user_input)
        print(f"\n🤖 AI: {response}\n")
