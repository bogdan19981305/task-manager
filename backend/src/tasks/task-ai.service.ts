import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class TaskAiService {
  private readonly logger = new Logger(TaskAiService.name);
  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.getOrThrow<string>('OPENAI_API_KEY');
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
    this.model = this.configService.getOrThrow<string>('OPENAI_MODEL');
  }

  async *streamTaskDescription(title: string): AsyncGenerator<string> {
    if (!this.client) {
      this.logger.warn('OPENAI_API_KEY is not set');
      throw new ServiceUnavailableException('AI is not configured');
    }

    let stream: AsyncIterable<OpenAI.Chat.Completions.ChatCompletionChunk>;
    try {
      stream = await this.client.chat.completions.create({
        model: this.model,
        stream: true,
        messages: [
          {
            role: 'system',
            content:
              'You write clear, actionable task descriptions for a task manager. ' +
              'Use plain language. No title repetition unless helpful. ' +
              'Keep it concise (roughly 3–8 sentences unless the title clearly needs more).',
          },
          {
            role: 'user',
            content: `Write a description for this task title:\n\n"${title}"`,
          },
        ],
      });
    } catch (err) {
      this.logger.error('OpenAI request failed', err);
      throw new ServiceUnavailableException('AI service unavailable');
    }

    try {
      for await (const chunk of stream) {
        const piece = chunk.choices[0]?.delta?.content ?? '';
        if (piece) yield piece;
      }
    } catch (err) {
      this.logger.error('OpenAI stream failed', err);
      throw new ServiceUnavailableException('AI stream interrupted');
    }
  }
}
