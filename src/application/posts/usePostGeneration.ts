import { useState } from 'react';
import { GeneratePostInput, GeneratedPost } from '../../domain/posts/Post';
import { GeneratePostUseCase } from './GeneratePostUseCase';
import { MockPostGenerator } from '../../infrastructure/ai/MockPostGenerator';

const postGenerator = new MockPostGenerator(); 
const generatePostUseCase = new GeneratePostUseCase(postGenerator);

export function usePostGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null);

  const generate = async (input: GeneratePostInput) => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generatePostUseCase.execute(input);
      setGeneratedPost(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    error,
    generatedPost,
    generate,
    setGeneratedPost 
  };
}
