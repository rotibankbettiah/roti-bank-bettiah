
export class GeminiService {
  async generateChatResponse(userPrompt: string): Promise<string> {
    try {
      // Use the injected API URL from Vite, or fallback to the Vite proxy/backend
      const apiUrl = import.meta.env.VITE_API_URL || '';
      
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userPrompt }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm currently experiencing some technical difficulties. Please contact us directly at **+91 9473228888**.";
    }
  }
}

export const geminiService = new GeminiService();
