export class ApiError extends Error {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

async function fetchWithConfig<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  // Inject mock authentication header expected by fastapi deps.py
  if (!headers.has('x-user-id')) {
    headers.set('x-user-id', '0617e7ab-5ebf-4194-9998-da938b447008'); // Seeded test user UI
  }

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData;
    let errorMessage = response.statusText;
    
    try {
      errorData = await response.json();
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      // It's not JSON, maybe text
      errorData = await response.text().catch(() => null);
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => fetchWithConfig<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestInit) => {
    return fetchWithConfig<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },
  put: <T>(endpoint: string, body: any, options?: RequestInit) => {
    return fetchWithConfig<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },
  patch: <T>(endpoint: string, body: any, options?: RequestInit) => {
    return fetchWithConfig<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
    });
  },
  delete: <T>(endpoint: string, options?: RequestInit) => fetchWithConfig<T>(endpoint, { ...options, method: 'DELETE' }),
};
