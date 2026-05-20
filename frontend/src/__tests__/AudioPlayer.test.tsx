import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import AudioPlayer from '@/components/AudioPlayer';

// Mock HTMLMediaElement methods
beforeEach(() => {
  vi.clearAllMocks();

  // Mock audio element methods
  Object.defineProperty(HTMLMediaElement.prototype, 'play', {
    writable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
    writable: true,
    value: vi.fn(),
  });
  Object.defineProperty(HTMLMediaElement.prototype, 'load', {
    writable: true,
    value: vi.fn(),
  });
});

describe('AudioPlayer', () => {
  const defaultProps = {
    src: 'https://api.example.com/audio/test.mp3',
    duration: 60,
  };

  describe('Rendering', () => {
    it('should render the audio player', () => {
      render(<AudioPlayer {...defaultProps} />);
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
    });

    it('should display formatted time', () => {
      render(<AudioPlayer {...defaultProps} />);
      expect(screen.getByText('0:00')).toBeInTheDocument();
      expect(screen.getByText('1:00')).toBeInTheDocument();
    });

    it('should have a progress slider', () => {
      render(<AudioPlayer {...defaultProps} />);
      expect(screen.getByLabelText('Audio progress')).toBeInTheDocument();
    });

    it('should display speed control defaulting to 1x', () => {
      render(<AudioPlayer {...defaultProps} />);
      expect(screen.getByText('1x')).toBeInTheDocument();
    });

    it('should render with RTL direction when isRtl is true', () => {
      const { container } = render(<AudioPlayer {...defaultProps} isRtl={true} />);
      const playerDiv = container.firstChild as HTMLElement;
      expect(playerDiv.getAttribute('dir')).toBe('rtl');
    });
  });

  describe('Play/Pause', () => {
    it('should show Play button initially', () => {
      render(<AudioPlayer {...defaultProps} />);
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
    });

    it('should toggle to Pause when Play is clicked', () => {
      render(<AudioPlayer {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Play'));
      expect(screen.getByLabelText('Pause')).toBeInTheDocument();
    });

    it('should toggle back to Play when Pause is clicked', () => {
      render(<AudioPlayer {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Play'));
      fireEvent.click(screen.getByLabelText('Pause'));
      expect(screen.getByLabelText('Play')).toBeInTheDocument();
    });
  });

  describe('Speed Control', () => {
    it('should cycle speed on button click: 1x → 1.25x', () => {
      render(<AudioPlayer {...defaultProps} />);
      fireEvent.click(screen.getByText('1x'));
      expect(screen.getByText('1.25x')).toBeInTheDocument();
    });

    it('should cycle through all speeds: 0.75, 1, 1.25, 1.5', () => {
      render(<AudioPlayer {...defaultProps} />);
      const speedBtn = screen.getByTitle('Change playback speed');

      // 1x → 1.25x → 1.5x → 0.75x → 1x
      fireEvent.click(speedBtn); // 1.25
      fireEvent.click(speedBtn); // 1.5
      fireEvent.click(speedBtn); // 0.75
      expect(screen.getByText('0.75x')).toBeInTheDocument();

      fireEvent.click(speedBtn); // back to 1
      expect(screen.getByText('1x')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when audio fails', async () => {
      const { container } = render(<AudioPlayer {...defaultProps} />);

      // Simulate error event on audio element using native Event dispatch
      const audio = container.querySelector('audio');
      await act(async () => {
        if (audio) {
          audio.dispatchEvent(new Event('error'));
        }
      });

      expect(screen.getByText(/Failed to load audio/)).toBeInTheDocument();
    });

    it('should show dismiss button when onClose is provided in error state', async () => {
      const onClose = vi.fn();
      const { container } = render(<AudioPlayer {...defaultProps} onClose={onClose} />);

      const audio = container.querySelector('audio');
      await act(async () => {
        if (audio) {
          audio.dispatchEvent(new Event('error'));
        }
      });

      expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });
  });

  describe('AI-Generated Label', () => {
    it('should have AI-generated title attribute', () => {
      const { container } = render(<AudioPlayer {...defaultProps} />);
      const playerDiv = container.firstChild as HTMLElement;
      expect(playerDiv.getAttribute('title')).toBe('AI-generated audio');
    });
  });
});
