import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UnitViewer from '@/pages/courses/UnitViewer';
import { courseService } from '@/services/courseService';

const navigateMock = vi.fn();
const togglePlayPauseMock = vi.fn();
const stopPlaybackMock = vi.fn();
const cyclePlaybackRateMock = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    useNavigate: () => navigateMock,
    useLocation: () => ({ pathname: '/courses/course-1/units/unit-1', state: null }),
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
          playbackRateLabel: '1.25x',
          togglePlayPause: togglePlayPauseMock,
          cyclePlaybackRate: cyclePlaybackRateMock,
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

// Floating audio control is intentionally hidden (UnitViewer line 658).
// Re-enable this test when the feature is restored.
describe.skip('UnitViewer floating audio control', () => {
  beforeEach(() => {
    vi.clearAllMocks();

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

  it('shows the floating controls whenever synced audio is active', async () => {
    render(<UnitViewer />);

    await waitFor(() => {
      expect(screen.getByText('Unit title')).toBeInTheDocument();
    });

    expect(screen.queryByLabelText('Pause audio')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Start floating audio'));

    const pauseButton = await screen.findByLabelText('Pause audio');
    const speedButton = await screen.findByLabelText('Playback speed: 1.25x');
    const stopButton = await screen.findByLabelText('Stop audio');

    fireEvent.click(pauseButton);
    fireEvent.click(speedButton);
    fireEvent.click(stopButton);

    expect(togglePlayPauseMock).toHaveBeenCalledTimes(1);
    expect(cyclePlaybackRateMock).toHaveBeenCalledTimes(1);
    expect(stopPlaybackMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Stop floating audio'));

    await waitFor(() => {
      expect(screen.queryByLabelText('Pause audio')).not.toBeInTheDocument();
    });
  });
});
