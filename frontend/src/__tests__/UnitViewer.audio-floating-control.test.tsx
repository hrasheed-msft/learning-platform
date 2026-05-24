import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UnitViewer from '@/pages/courses/UnitViewer';
import { courseService } from '@/services/courseService';

const navigateMock = vi.fn();
const togglePlayPauseMock = vi.fn();
const stopPlaybackMock = vi.fn();
let intersectionCallback: ((entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting'>>) => void) | null = null;

class MockIntersectionObserver {
  constructor(callback: (entries: Array<Pick<IntersectionObserverEntry, 'isIntersecting'>>) => void) {
    intersectionCallback = callback;
  }

  observe() {}

  disconnect() {}

  unobserve() {}

  takeRecords() {
    return [];
  }
}

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    useNavigate: () => navigateMock,
    useParams: () => ({ courseId: 'course-1', unitId: 'unit-1' }),
  };
});

vi.mock('@/components/UnitAudioButton', () => ({
  __esModule: true,
  default: ({ onSyncStateChange }: { onSyncStateChange?: (state: any) => void }) => (
    <div>
      <button
        type="button"
        onClick={() => onSyncStateChange?.({
          language: 'en',
          timestamps: [],
          currentWordIndex: 0,
          isPlaying: true,
          currentTime: 1,
          duration: 12,
          togglePlayPause: togglePlayPauseMock,
          stopPlayback: stopPlaybackMock,
        })}
      >
        Start floating audio
      </button>
      <button type="button" onClick={() => onSyncStateChange?.(null)}>
        Stop floating audio
      </button>
    </div>
  ),
}));

vi.mock('@/components/SyncedTextContent', () => ({
  __esModule: true,
  default: () => <div data-testid="synced-text-content" />,
}));

vi.mock('@/services/courseService', () => ({
  courseService: {
    getUnit: vi.fn(),
    getUnits: vi.fn(),
    updateProgress: vi.fn(),
  },
}));

describe('UnitViewer floating audio control', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    intersectionCallback = null;
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);

    vi.mocked(courseService.getUnit).mockResolvedValue({
      id: 'unit-1',
      title: 'Unit title',
      description: 'Unit description',
      content: {
        text: '<p>Hello world</p>',
        videos: [],
        audio: [],
        arabicTerms: [],
      },
    } as any);
    vi.mocked(courseService.getUnits).mockResolvedValue([
      { id: 'unit-1', title: 'Unit title' },
    ] as any);
    vi.mocked(courseService.updateProgress).mockResolvedValue({} as any);
  });

  it('shows the floating controls only when synced audio is active and the main controls are out of view', async () => {
    render(<UnitViewer />);

    await waitFor(() => {
      expect(screen.getByText('Unit title')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Start floating audio'));

    act(() => {
      intersectionCallback?.([{ isIntersecting: false }]);
    });

    const pauseButton = await screen.findByLabelText('Pause audio');
    const stopButton = await screen.findByLabelText('Stop audio');

    fireEvent.click(pauseButton);
    fireEvent.click(stopButton);

    expect(togglePlayPauseMock).toHaveBeenCalledTimes(1);
    expect(stopPlaybackMock).toHaveBeenCalledTimes(1);

    act(() => {
      intersectionCallback?.([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      expect(screen.queryByLabelText('Pause audio')).not.toBeInTheDocument();
    });

    act(() => {
      intersectionCallback?.([{ isIntersecting: false }]);
    });

    fireEvent.click(screen.getByText('Stop floating audio'));

    await waitFor(() => {
      expect(screen.queryByLabelText('Pause audio')).not.toBeInTheDocument();
    });
  });
});
