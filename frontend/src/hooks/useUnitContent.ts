import { useState, useEffect } from 'react';
import type { UnitContent } from '@/types/course';

interface UseUnitContentResult {
  html: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * Resolves the HTML content for a unit.
 * If contentUrl is set, fetches from Azure Blob Storage.
 * Otherwise falls back to inline text (backward compat during migration).
 */
export function useUnitContent(content: UnitContent | null | undefined): UseUnitContentResult {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!content) {
      setHtml(null);
      setLoading(false);
      setError(null);
      return;
    }

    if (content.contentUrl) {
      setLoading(true);
      setError(null);
      setHtml(null);

      fetch(content.contentUrl)
        .then(res => {
          if (!res.ok) throw new Error(`Failed to load content (${res.status})`);
          return res.text();
        })
        .then(text => {
          setHtml(text);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch unit content from blob:', err);
          setError('Content could not be loaded. Please try again.');
          setLoading(false);
          // Fall back to inline text if available
          if (content.text) setHtml(content.text);
        });
    } else if (content.text) {
      setHtml(content.text);
      setLoading(false);
      setError(null);
    } else {
      setHtml(null);
      setLoading(false);
      setError(null);
    }
  }, [content?.contentUrl, content?.text]);

  return { html, loading, error };
}
