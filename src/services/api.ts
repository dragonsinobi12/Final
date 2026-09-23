import type { RegistrationInput, Session, Spot, Bug } from '../types';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export class ApiError extends Error {
  constructor(message: string, public readonly status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init: RequestInit = {}, timeoutMs = 8000): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json', ...(init.headers ?? {}) },
    });
    if (!response.ok) throw new ApiError(`เซิร์ฟเวอร์ตอบกลับ ${response.status}`, response.status);
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่');
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  getSpots: () => request<Spot[]>('/spots'),
  getBugs: () => request<Bug[]>('/bugs'),
  login: (email: string, password: string) => request<Session>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  registerCatch: (input: RegistrationInput, token: string) => request<{ id: string; unlockedBugIds: string[] }>('/registrations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(input),
  }),
};
