import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import VideoPlayer from '@/components/VideoPlayer';

// Mock HTMLMediaElement methods
beforeEach(() => {
  vi.clearAllMocks();

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

  // Mock fullscreen API
  Object.defineProperty(document, 'fullscreenElement', {
    writable: true,
    value: null,
  });
  Object.defineProperty(HTMLElement.prototype, 'requestFullscreen', {
    writable: true,
    value: vi.fn().mockResolvedValue(undefined),
  });
});

describe('VideoPlayer', () => {
  const defaultProps = {
    src: 'https://cdn.example.com/video/unit-1-en.mp4',
  };

  describe('Rendering', () => {
    it('should render the video player', () => {
      render(<VideoPlayer {...defaultProps} />);
      expect(screen.getByLabelText('Play video')).toBeInTheDocument();
    });

    it('should display AI-Generated badge', () => {
      render(<VideoPlayer {...defaultProps} />);
      expect(screen.getByText('🤖 AI-Generated')).toBeInTheDocument();
    });

    it('should show the video element with correct src', () => {
      const { container } = render(<VideoPlayer {...defaultProps} />);
      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();
      expect(video?.getAttribute('src')).toBe(defaultProps.src);
    });

    it('should render close button when onClose is provided', () => {
      const onClose = vi.fn();
      render(<VideoPlayer {...defaultProps} onClose={onClose} />);
      expect(screen.getByLabelText('Close video')).toBeInTheDocument();
    });

    it('should not render close button when onClose is not provided', () => {
      render(<VideoPlayer {...defaultProps} />);
      expect(screen.queryByLabelText('Close video')).not.toBeInTheDocument();
    });
  });

  describe('States', () => {
    it('should show play overlay when paused (initial state)', () => {
      render(<VideoPlayer {...defaultProps} />);
      expect(screen.getByLabelText('Play video')).toBeInTheDocument();
    });

    it('should hide play overlay when playing', () => {
      render(<VideoPlayer {...defaultProps} />);
      fireEvent.click(screen.getByLabelText('Play video'));
      expect(screen.queryByLabelText('Play video')).not.toBeInTheDocument();
    });

    it('should show error state when video fails to load', async () => {
      const { container } = render(<VideoPlayer {...defaultProps} />);
      const video = container.querySelector('video');
      await act(async () => {
        if (video) {
          video.dispatchEvent(new Event('error'));
        }
      });
      expect(screen.getByText(/Failed to load video/)).toBeInTheDocument();
    });
  });

  describe('RTL Support', () => {
    it('should set dir=rtl when isRtl is true', () => {
      const { container } = render(<VideoPlayer {...defaultProps} isRtl={true} />);
      const playerDiv = container.firstChild as HTMLElement;
      expect(playerDiv.getAttribute('dir')).toBe('rtl');
    });
  });

  describe('Speed Control', () => {
    it('should have speed control showing 1x by default', () => {
      render(<VideoPlayer {...defaultProps} />);
      expect(screen.getByLabelText('Playback speed: 1x')).toBeInTheDocument();
    });
  });
});
