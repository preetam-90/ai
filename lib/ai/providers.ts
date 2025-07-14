import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { google } from '@ai-sdk/google';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { isTestEnvironment } from '../constants';

// Try to use Gemini API, fallback to mock if API key is invalid
let useGeminiProvider = false;

try {
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY && process.env.GOOGLE_GENERATIVE_AI_API_KEY.length > 20) {
    useGeminiProvider = true;
  }
} catch (error) {
  console.warn('Gemini API key not available, using mock provider');
}

export const myProvider = useGeminiProvider && !isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': google('gemini-1.5-flash'),
        'chat-model-reasoning': wrapLanguageModel({
          model: google('gemini-1.5-flash'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': google('gemini-1.5-flash'),
        'artifact-model': google('gemini-1.5-flash'),
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    });
