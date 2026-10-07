import { PostGenerator, GeneratePostInput, GeneratedPost } from '../../domain/posts/Post';

export class GeneratePostUseCase {
  constructor(private postGenerator: PostGenerator) {}

  async execute(input: GeneratePostInput): Promise<GeneratedPost> {
    if (!input.eventTitle) {
      throw new Error("Event title is required to generate a post.");
    }
    
    // Additional validation or normalization can happen here
    const normalizedInput = {
      ...input,
      tone: input.tone || 'professional',
    };

    return await this.postGenerator.generate(normalizedInput);
  }
}
