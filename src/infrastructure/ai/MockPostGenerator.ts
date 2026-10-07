import { PostGenerator, GeneratePostInput, GeneratedPost } from '../../domain/posts/Post';

export class MockPostGenerator implements PostGenerator {
  async generate(input: GeneratePostInput): Promise<GeneratedPost> {
    // Simulate AI generation time
    await new Promise(resolve => setTimeout(resolve, 1500));

    let content = \Just wrapped up an incredible time at \!\n\n\;
    if (input.takeaways) {
      content += \My biggest takeaways:\n\\n\n\;
    }
    content += \Feeling \ about the future!\;

    return {
      id: \post-\\,
      content,
      hashtags: ['#Event', '#Tech', '#AI'],
      tone: input.tone
    };
  }
}
