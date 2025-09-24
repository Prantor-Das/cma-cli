import { useState, useEffect } from "react";

interface UseApiOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T = any>(url: string | null, options: UseApiOptions = {}): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(url!, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: T = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  const refetch = () => {
    if (url) {
      const fetchData = async () => {
        try {
          setLoading(true);
          setError(null);
          
          const response = await fetch(url, {
            headers: {
              "Content-Type": "application/json",
              ...options.headers,
            },
            ...options,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result: T = await response.json();
          setData(result);
        } catch (err) {
          setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  };

  return { data, loading, error, refetch };
}