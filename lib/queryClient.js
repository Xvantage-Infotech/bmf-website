import { QueryClient } from '@tanstack/react-query';

async function throwIfResNotOk(res) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
  }
}

export async function apiRequest(url, options = {}) {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (config.body && typeof config.body !== 'string') {
    config.body = JSON.stringify(config.body);
  }

  const res = await fetch(url, config);
  await throwIfResNotOk(res);
  
  const contentType = res.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
}

export const getQueryFn = ({ on401 = "throw" } = {}) => {
  return async ({ queryKey }) => {
    const url = Array.isArray(queryKey) ? queryKey[0] : queryKey;
    
    try {
      const res = await fetch(url);
      
      if (res.status === 401) {
        if (on401 === "returnNull") {
          return null;
        }
        throw new Error('Unauthorized');
      }
      
      await throwIfResNotOk(res);
      return res.json();
    } catch (error) {
      if (on401 === "returnNull" && error.message.includes('401')) {
        return null;
      }
      throw error;
    }
  };
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn(),
      staleTime: 60 * 1000,
      retry: false,
    },
  },
});