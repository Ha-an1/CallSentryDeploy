const CHAT_ENDPOINT = "http://localhost:5000/chat";

export interface ChatApiResponse {
  response: string;
  fraud_confidence?: number;
}

export async function sendChatMessage(
  message: string,
  conversationId: string
): Promise<ChatApiResponse> {
  const res = await fetch(CHAT_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId
    })
  });

  if (!res.ok) {
    throw new Error("Backend chat failed");
  }

  return res.json();
}
