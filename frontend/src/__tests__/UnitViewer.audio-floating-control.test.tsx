import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import UnitViewer from '@/pages/courses/UnitViewer';
import { courseService } from '@/services/courseService';

const navigateMock = vi.fn();
const togglePlayPauseMock = vi.fn();

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

  it('shows a fixed pause/play button while synced audio is active', async () => {
    render(<UnitViewer />);

    await waitFor(() => {
      expect(screen.getByText('Unit title')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Start floating audio'));

    const floatingControl = screen.getByLabelText('Pause audio');
    expect(floatingControl).toBeInTheDocument();

    fireEvent.click(floatingControl);
    expect(togglePlayPauseMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Stop floating audio'));
    expect(screen.queryByLabelText('Pause audio')).not.toBeInTheDocument();
  });
});
