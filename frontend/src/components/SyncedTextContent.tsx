import { useCallback, useEffect, useMemo, useRef } from 'react';
import React from 'react';

type SyncLanguage = 'ar' | 'en';

interface SyncedTextContentProps {
  html: string;
  currentWordIndex: number;
  language: SyncLanguage | null;
  isPlaying: boolean;
  className?: string;
}

const LANGUAGE_TOKEN_MATCHERS: Record<SyncLanguage, RegExp> = {
  en: /[A-Za-z0-9]/,
  ar: /[\u0600-\u06FF]/,
};

const HIGHLIGHT_CLASSES: Record<SyncLanguage, string> = {
  en: 'bg-amber-100 text-amber-900 ring-1 ring-amber-300 font-semibold',
  ar: 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-300 font-semibold',
};

// Void elements cannot have children in React (error #137)
const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

export default function SyncedTextContent({
  html,
  currentWordIndex,
  language,
  isPlaying,
  className,
}: SyncedTextContentProps) {
  const activeWordRef = useRef<HTMLSpanElement | null>(null);
  const setActiveWordRef = useCallback((node: HTMLSpanElement | null) => {
    activeWordRef.current = node;
  }, []);

  const shouldHighlight = Boolean(language && isPlaying && currentWordIndex >= 0);

  const renderedContent = useMemo(() => {
    if (!shouldHighlight || !language) {
      return null;
    }

    try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const tokenMatcher = LANGUAGE_TOKEN_MATCHERS[language];
    const highlightClass = HIGHLIGHT_CLASSES[language];
    let trackedWordIndex = -1;

    const renderNode = (node: ChildNode, key: string): React.ReactNode => {
      if (node.nodeType === 3) {
        const text = node.textContent ?? '';
        return text.split(/(\s+)/).map((part, index) => {
          if (!part) {
            return null;
          }

          if (/^\s+$/.test(part)) {
            return part;
          }

          if (!tokenMatcher.test(part)) {
            return part;
          }

          trackedWordIndex += 1;
          const isActive = trackedWordIndex === currentWordIndex;

          return (
            <span
              key={`${key}-word-${index}`}
              ref={isActive ? setActiveWordRef : undefined}
              className={`inline rounded px-1 py-0.5 transition-colors duration-150 ${isActive ? highlightClass : ''}`.trim()}
              aria-current={isActive ? 'true' : undefined}
            >
              {part}
            </span>
          );
        });
      }

      if (node.nodeType !== 1) {
        return null;
      }

      const element = node as HTMLElement;
      const props: Record<string, unknown> = { key };

      Array.from(element.attributes).forEach((attribute) => {
        if (attribute.name === 'class') {
          props.className = attribute.value;
          return;
        }

        if (attribute.name === 'for') {
          props.htmlFor = attribute.value;
          return;
        }

        if (attribute.name === 'tabindex') {
          props.tabIndex = attribute.value;
          return;
        }

        if (attribute.name === 'style') {
          return;
        }

        props[attribute.name] = attribute.value;
      });

      const tagName = element.tagName.toLowerCase();

      if (VOID_ELEMENTS.has(tagName)) {
        return React.createElement(tagName, props);
      }

      const children = Array.from(element.childNodes).map((child, index) => renderNode(child, `${key}-${index}`));
      return React.createElement(tagName, props, children);
    };

    return Array.from(doc.body.childNodes).map((node, index) => renderNode(node, `node-${index}`));
    } catch {
      // Fall back to raw HTML if parsing/rendering fails
      return null;
    }
  }, [currentWordIndex, html, language, setActiveWordRef, shouldHighlight]);

  useEffect(() => {
    if (!shouldHighlight || !activeWordRef.current) {
      return;
    }

    activeWordRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  }, [currentWordIndex, shouldHighlight]);

  if (!shouldHighlight || !renderedContent) {
    return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return <div className={className}>{renderedContent}</div>;
}
