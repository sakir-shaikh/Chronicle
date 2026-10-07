import { GoogleGenAI } from '@google/genai';
import { PostGenerator, GeneratePostInput, GeneratedPost } from '../../domain/posts/Post';

export class GeminiPostGenerator implements PostGenerator {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generate(input: GeneratePostInput): Promise<GeneratedPost> {
    const prompt = `
    You are writing a LinkedIn post for an attendee named ${input.attendeeName || 'someone'} who just attended the event "${input.eventTitle}".
    The desired tone of the post is: ${input.tone}.
    ${input.takeaways ? `Key takeaways to include:\n${input.takeaways}` : ''}
    
    Please write an engaging LinkedIn post, keeping it professional but matching the tone. Include some relevant hashtags at the end.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });

      const text = response.text || '';
      
      const hashtagsMatch = text.match(/#[a-zA-Z0-9_]+/g);
      const hashtags = hashtagsMatch ? hashtagsMatch : [];

      return {
        id: `gemini-post-${Date.now()}`,
        content: text,
        hashtags,
        tone: input.tone
      };
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw new Error('Failed to generate post with Gemini AI');
    }
  }
}
