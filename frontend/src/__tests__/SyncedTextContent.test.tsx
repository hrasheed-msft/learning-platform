import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SyncedTextContent from '@/components/SyncedTextContent';

describe('SyncedTextContent', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
  });

  it('highlights the active English word inside existing markup', () => {
    render(
      <SyncedTextContent
        html="<p>Hello <strong>beautiful</strong> world</p>"
        currentWordIndex={1}
        language="en"
        isPlaying={true}
      />
    );

    const highlightedWord = screen.getByText('beautiful');

    expect(highlightedWord.tagName).toBe('SPAN');
    expect(highlightedWord).toHaveAttribute('aria-current', 'true');
    expect(highlightedWord.className).toContain('bg-amber-100');
    expect(document.querySelector('strong')).not.toBeNull();
  });

  it('uses emerald highlighting for Arabic playback', () => {
    render(
      <SyncedTextContent
        html={'<p dir="rtl">السلام عليكم ورحمة الله</p>'}
        currentWordIndex={1}
        language="ar"
        isPlaying={true}
      />
    );

    const highlightedWord = screen.getByText('عليكم');
    expect(highlightedWord.className).toContain('bg-emerald-100');
  });

  it('renders raw HTML when audio is not actively playing', () => {
    render(
      <SyncedTextContent
        html="<p>Hello world</p>"
        currentWordIndex={1}
        language="en"
        isPlaying={false}
      />
    );

    const paragraph = screen.getByText('Hello world');
    expect(paragraph.tagName).toBe('P');
  });
});
