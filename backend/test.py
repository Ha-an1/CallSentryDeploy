import torch
from transformers import AutoTokenizer, DistilBertForSequenceClassification
from dotenv import load_dotenv
from google import genai
from google.genai import types
import os

load_dotenv()
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

try:
    gemini_client = genai.Client(api_key=GEMINI_API_KEY)
except Exception as e:
    print(f"Error initializing Gemini client: {e}")
    gemini_client = None

model_path = "fine_tuned_fraud_model"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = DistilBertForSequenceClassification.from_pretrained(model_path)

def predict_fraud(text):
    inputs = tokenizer(text, padding="max_length", truncation=True, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    prediction = torch.argmax(logits, dim=1).item()
    return "Fraudulent Call 🚨" if prediction == 1 else "Safe Call ✅"

ques=input("Enter the conversation:")
sample_text = ques
result = predict_fraud(sample_text)
print(f"Prediction: {result}")


