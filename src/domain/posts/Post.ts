export interface GeneratePostInput {
  eventId: string;
  eventTitle: string;
  tone: string;
  takeaways?: string;
  photos?: string[];
  attendeeName?: string;
}

export interface GeneratedPost {
  id: string;
  content: string;
  hashtags: string[];
  tone: string;
}

export interface PostGenerator {
  generate(input: GeneratePostInput): Promise<GeneratedPost>;
}
