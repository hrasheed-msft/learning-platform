import { useState, useEffect } from 'react';
import type { UnitContent } from '@/types/course';

interface UseUnitContentResult {
  html: string | null;
  loading: boolean;
  error: string | null;
}

// Blob storage base URL for coursebook diagram images.
// Defaults to the production blob account; override with VITE_COURSEBOOK_IMAGES_URL in .env.
const COURSEBOOK_IMAGES_URL =
  import.meta.env.VITE_COURSEBOOK_IMAGES_URL ||
  'https://stislamiclearning.blob.core.windows.net/coursebook-images';

/**
 * Rewrite relative /coursebook-images/ paths to absolute blob URLs so that
 * diagram images resolve correctly when HTML is rendered inside the SWA rather
 * than being served via the API proxy.
 */
function rewriteImagePaths(html: string): string {
  return html.replace(
    /src="\/coursebook-images\//g,
    `src="${COURSEBOOK_IMAGES_URL}/`
  );
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
          setHtml(rewriteImagePaths(text));
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
