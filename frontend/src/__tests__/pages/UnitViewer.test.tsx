import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
