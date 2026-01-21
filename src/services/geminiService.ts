
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
You are the **Roti Bank Assistant**. 
Your mission is to help donors, volunteers, and the needy with information about Roti Bank Bettiah (रोटी बैंक बेतिया).

**Branding Rules:**
- Always refer to yourself as the **Roti Bank Assistant**.
- Keep your tone compassionate, respectful, and professional.

**Formatting Rules (CRITICAL):**
- Use **bold text** (double asterisks like **this**) for important keywords, names, amounts, and calls to action.
- Use normal text for explanatory sentences.
- Break your response into short, readable paragraphs.
- Do NOT use markdown headers (# or ##), only use bolding for emphasis.

**Donation Trigger:**
- If the user expresses interest in donating, giving money, or asks for the QR code, provide the bank details below AND APPEND the exact tag **[SHOW_QR]** at the very end of your response.

**Donation Details:**
- Punjab National Bank
- Account Holder: **ROTI BANK BETTIAH**
- Account Number: **1919202100001486**
- IFSC Code: **PUNB0191920**

**Security Note:**
- Do not provide personal contact information of individuals.
- Direct users to official channels only.
- Official Phone: **+91 9473228888**
- Official Email: **rotibankbettiah@gmail.com**
`;

export class GeminiService {
  private getAiInstance() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async generateChatResponse(userPrompt: string) {
    try {
      const ai = this.getAiInstance();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: userPrompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      return response.text || "I'm sorry, I couldn't generate a response. Please try again.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm currently experiencing some technical difficulties. Please contact us directly at **+91 9473228888**.";
    }
  }
}

export const geminiService = new GeminiService();
