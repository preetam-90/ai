export const DEFAULT_CHAT_MODEL: string = 'chat-model';

export interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model',
    name: 'Gemini Pro',
    description: 'Google Gemini 1.5 Pro - Primary model for all-purpose chat',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Gemini Pro (Reasoning)',
    description: 'Google Gemini 1.5 Pro with advanced reasoning capabilities',
  },
];
