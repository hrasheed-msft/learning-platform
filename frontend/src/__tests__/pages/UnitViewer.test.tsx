import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import UnitViewer from '@/pages/courses/UnitViewer';
import { courseService } from '@/services/courseService';

vi.mock('@/services/courseService', () => ({
  courseService: {
    getUnit: vi.fn(),
    getUnits: vi.fn(),
    updateProgress: vi.fn(),
  },
}));

vi.mock('@/components/UnitAudioButton', () => ({
  default: () => <div>Audio controls</div>,
}));

vi.mock('@/hooks/useUnitContent', () => ({
  useUnitContent: (content: { text?: string } | undefined) => ({
    html: content?.text ?? '',
    loading: false,
    error: null,
  }),
}));

const baseUnit = {
  id: 'unit-2',
  courseId: 'course-1',
  orderIndex: 2,
  title: 'Week 3',
  description: 'Lesson overview',
  content: {
    text: '<p>Read the <a href="/lessons/masaar-irab-sarf/week-3.html" target="_blank" rel="noopener noreferrer">inline interactive lesson link</a>.</p>',
    videos: [],
    audio: [],
    arabicTerms: [],
  },
};

function renderUnitViewer() {
  return render(
    <MemoryRouter initialEntries={['/courses/course-1/units/unit-2']}>
      <Routes>
        <Route path="/courses/:courseId/units/:unitId" element={<UnitViewer />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('UnitViewer', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(courseService.getUnit).mockResolvedValue(baseUnit as any);
    vi.mocked(courseService.getUnits).mockResolvedValue([
      { id: 'unit-1', title: 'Week 2', description: 'Earlier unit', orderIndex: 1 },
      baseUnit,
      { id: 'unit-3', title: 'Week 4', description: 'Later unit', orderIndex: 3 },
    ] as any);
    vi.mocked(courseService.updateProgress).mockResolvedValue({} as any);
  });

  it('renders inline HTML lesson links and shows a prominent interactive lesson button', async () => {
    renderUnitViewer();

    const primaryLessonLink = await screen.findByRole('link', { name: /open full interactive lesson/i });
    expect(primaryLessonLink).toHaveAttribute('href', '/lessons/masaar-irab-sarf/week-3.html');
    expect(primaryLessonLink).toHaveAttribute('target', '_blank');
    expect(primaryLessonLink).toHaveAttribute('rel', 'noopener noreferrer');

    const inlineLessonLink = screen.getByRole('link', { name: /inline interactive lesson link/i });
    expect(inlineLessonLink).toHaveAttribute('href', '/lessons/masaar-irab-sarf/week-3.html');
    expect(inlineLessonLink).toHaveAttribute('target', '_blank');
  });

  it('hides the prominent lesson button when unit content does not include a hosted lesson path', async () => {
    vi.mocked(courseService.getUnit).mockResolvedValue({
      ...baseUnit,
      content: {
        ...baseUnit.content,
        text: '<p>No standalone lesson link in this unit.</p>',
      },
    } as any);

    renderUnitViewer();

    await screen.findByText(/no standalone lesson link in this unit/i);
    expect(screen.queryByRole('link', { name: /open full interactive lesson/i })).not.toBeInTheDocument();
  });

  describe('pronunciation guide toggle', () => {
    const guideHtml =
      '<div><p lang="ar">بَ</p><p dir="ltr"><span class="nq-tr">ba </span><span>🔊</span></p></div>';

    beforeEach(() => {
      window.localStorage.removeItem('nuraniyyah-show-transliterations');
      vi.mocked(courseService.getUnit).mockResolvedValue({
        ...baseUnit,
        content: { ...baseUnit.content, text: guideHtml },
      } as any);
    });

    it('is off by default and shows the guide only after the learner switches it on', async () => {
      const { container } = renderUnitViewer();

      const toggle = await screen.findByRole('switch', { name: /show pronunciation guide/i });
      const guide = container.querySelector('.nq-tr') as HTMLElement;
      expect(toggle).toHaveAttribute('aria-checked', 'false');
      expect(container.querySelector('[data-transliterations]')).toHaveAttribute('data-transliterations', 'off');
      expect(getComputedStyle(guide).display).toBe('none');
      expect(screen.getByText('🔊')).toBeVisible();

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-checked', 'true');
      expect(container.querySelector('[data-transliterations]')).toHaveAttribute('data-transliterations', 'on');
      expect(getComputedStyle(guide).display).not.toBe('none');
    });

    it('is not offered for units without a pronunciation guide', async () => {
      vi.mocked(courseService.getUnit).mockResolvedValue({
        ...baseUnit,
        content: { ...baseUnit.content, text: '<p>Plain lesson.</p>' },
      } as any);

      renderUnitViewer();

      await screen.findByText(/plain lesson/i);
      expect(screen.queryByRole('switch', { name: /show pronunciation guide/i })).not.toBeInTheDocument();
    });
  });
});
