import { aiKnowledgeEngine } from './aiKnowledgeEngine';

/**
 * Autonomous AI Service for Roti Bank Bettiah
 * Answers all donor, volunteer, legal, and operational questions instantly
 * without requiring any external Gemini API key or backend server.
 */
export class GeminiService {
  async generateChatResponse(userPrompt: string): Promise<string> {
    try {
      // Natural subtle typing delay (250ms)
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // Generate intelligent answer from our native Roti Bank AI Engine
      const response = aiKnowledgeEngine.generateResponse(userPrompt);
      return response;
    } catch (error) {
      console.error("AI Assistant Error:", error);
      return "Namaste! I am here to help you with **Roti Bank Bettiah**. For immediate assistance, please call our official helpline at **+91 9473228888** or email **rotibankbettiah@gmail.com**.";
    }
  }

  /**
   * Helper to retrieve suggested follow-up chips
   */
  getSuggestions(userPrompt: string): string[] {
    return aiKnowledgeEngine.getFollowUpSuggestions(userPrompt);
  }
}

export const geminiService = new GeminiService();
