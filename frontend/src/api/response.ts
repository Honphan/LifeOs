export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export function unwrapApiResponse<T>(payload: unknown): T {
  if (payload && typeof payload === 'object') {
    const record = payload as Record<string, unknown>;
    if ('data' in record) {
      return record.data as T;
    }
  }

  return payload as T;
}

export function readApiMessage(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const record = value as Record<string, unknown>;
  const message = record.message ?? record.error ?? record.detail;
  if (typeof message === 'string' && message.trim()) return message;

  const nested = record.data;
  if (nested && typeof nested === 'object') {
    return readApiMessage(nested);
  }

  return undefined;
}

export function readApiToken(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;

  const record = value as Record<string, unknown>;
  const token = record.accessToken ?? record.token ?? record.jwt ?? record.idToken;
  if (typeof token === 'string' && token.trim()) return token;

  const nested = record.data;
  if (nested && typeof nested === 'object') {
    return readApiToken(nested);
  }

  return undefined;
}