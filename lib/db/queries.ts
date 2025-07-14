import 'server-only';

import type { 
  Chat, 
  DBMessage, 
  User 
} from './schema';
import type { ArtifactKind } from '@/components/artifact';
import type { VisibilityType } from '@/components/visibility-selector';

// In-memory storage for development
let mockChats: Chat[] = [];
let mockMessages: DBMessage[] = [];
let mockUsers: User[] = [];
let mockVotes: any[] = [];
let mockDocuments: any[] = [];
let mockSuggestions: any[] = [];

export async function getUser(email: string): Promise<Array<User>> {
  return mockUsers.filter(user => user.email === email);
}

export async function createUser(email: string, password: string) {
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password,
  };
  mockUsers.push(newUser);
  return newUser;
}

export async function createGuestUser() {
  const newUser = {
    id: `guest-${Date.now()}`,
    email: `guest-${Date.now()}@example.com`,
    password: 'mock-password',
  };
  mockUsers.push(newUser);
  return [newUser];
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  const chat: Chat = {
    id,
    userId,
    title,
    visibility,
    createdAt: new Date(),
  };
  mockChats.push(chat);
  return chat;
}

export async function deleteChatById({ id }: { id: string }) {
  const chatIndex = mockChats.findIndex(chat => chat.id === id);
  if (chatIndex === -1) return null;
  
  const deletedChat = mockChats[chatIndex];
  mockChats.splice(chatIndex, 1);
  
  // Remove related messages and votes
  mockMessages = mockMessages.filter(msg => msg.chatId !== id);
  mockVotes = mockVotes.filter(vote => vote.chatId !== id);
  
  return deletedChat;
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  let userChats = mockChats.filter(chat => chat.userId === id);
  userChats.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  const hasMore = userChats.length > limit;
  const chats = userChats.slice(0, limit);
  
  return {
    chats,
    hasMore,
  };
}

export async function getChatById({ id }: { id: string }) {
  return mockChats.find(chat => chat.id === id) || null;
}

export async function saveMessages({
  messages,
}: {
  messages: Array<DBMessage>;
}) {
  mockMessages.push(...messages);
  return messages;
}

export async function getMessagesByChatId({ id }: { id: string }) {
  return mockMessages
    .filter(msg => msg.chatId === id)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
}

export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  const existingVoteIndex = mockVotes.findIndex(vote => 
    vote.messageId === messageId && vote.chatId === chatId
  );
  
  if (existingVoteIndex >= 0) {
    mockVotes[existingVoteIndex].isUpvoted = type === 'up';
  } else {
    mockVotes.push({
      chatId,
      messageId,
      isUpvoted: type === 'up',
    });
  }
  
  return {};
}

export async function getVotesByChatId({ id }: { id: string }) {
  return mockVotes.filter(vote => vote.chatId === id);
}

export async function saveDocument({
  id,
  title,
  kind,
  content,
  userId,
}: {
  id: string;
  title: string;
  kind: ArtifactKind;
  content: string;
  userId: string;
}) {
  const document = {
    id,
    title,
    kind,
    content,
    userId,
    createdAt: new Date(),
  };
  mockDocuments.push(document);
  return [document];
}

export async function getDocumentsById({ id }: { id: string }) {
  return mockDocuments.filter(doc => doc.id === id);
}

export async function getDocumentById({ id }: { id: string }) {
  return mockDocuments.find(doc => doc.id === id) || null;
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  const deletedDocs = mockDocuments.filter(doc => 
    doc.id === id && doc.createdAt > timestamp
  );
  mockDocuments = mockDocuments.filter(doc => 
    !(doc.id === id && doc.createdAt > timestamp)
  );
  return deletedDocs;
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<any>;
}) {
  mockSuggestions.push(...suggestions);
  return suggestions;
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  return mockSuggestions.filter(suggestion => 
    suggestion.documentId === documentId
  );
}

export async function getMessageById({ id }: { id: string }) {
  const messages = mockMessages.filter(msg => msg.id === id);
  return messages.length > 0 ? messages : [];
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  const messagesToDelete = mockMessages.filter(msg => 
    msg.chatId === chatId && msg.createdAt >= timestamp
  );
  
  mockMessages = mockMessages.filter(msg => 
    !(msg.chatId === chatId && msg.createdAt >= timestamp)
  );
  
  return messagesToDelete;
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: 'private' | 'public';
}) {
  const chat = mockChats.find(c => c.id === chatId);
  if (chat) {
    chat.visibility = visibility;
  }
  return chat;
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: { id: string; differenceInHours: number }) {
  const cutoffTime = new Date(Date.now() - differenceInHours * 60 * 60 * 1000);
  
  return mockMessages.filter(msg => {
    const chat = mockChats.find(c => c.id === msg.chatId);
    return chat?.userId === id && 
           msg.createdAt >= cutoffTime && 
           msg.role === 'user';
  }).length;
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  // Mock implementation - just return success
  return { streamId, chatId };
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  // Mock implementation - return empty array for now
  return [];
}
