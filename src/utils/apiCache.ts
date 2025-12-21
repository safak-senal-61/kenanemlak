export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes default

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export async function fetchWithCache<T>(
  url: string,
  options?: RequestInit,
  duration: number = CACHE_DURATION
): Promise<T | null> {
  // Only use cache on client side
  if (typeof window === 'undefined') {
    const response = await fetch(url, options);
    if (response.status === 404) {
      return null;
    }
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

  const cacheKey = `k_cache_${url}`;
  
  // Try to get from cache
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed: CacheItem<T> = JSON.parse(cached);
      const now = Date.now();
      
      if (now - parsed.timestamp < duration) {
        // console.log(`Using cached data for ${url}`);
        return parsed.data;
      }
    }
  } catch (e) {
    console.warn('Cache read error:', e);
  }

  // Fetch from network
  // console.log(`Fetching from network for ${url}`);
  const response = await fetch(url, options);
  
  if (response.status === 404) {
    // If it was in cache (stale), we should remove it?
    // The code above didn't return from cache, so it's fine.
    // But if we want to be proactive about cleaning up stale keys if they exist:
    localStorage.removeItem(cacheKey);
    return null;
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  const data = await response.json();

  // Save to cache
  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(cacheKey, JSON.stringify(cacheItem));
  } catch (e) {
    console.warn('Cache write error:', e);
  }

  return data;
}

export function clearCache(urlPattern?: string) {
  if (typeof window === 'undefined') return;

  if (!urlPattern) {
    // Clear all app cache
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('k_cache_')) {
        localStorage.removeItem(key);
      }
    });
  } else {
    // Clear specific
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('k_cache_') && key.includes(urlPattern)) {
        localStorage.removeItem(key);
      }
    });
  }
}
