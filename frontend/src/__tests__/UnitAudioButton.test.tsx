import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UnitAudioButton from '@/components/UnitAudioButton';

// Mock the audio service
vi.mock('@/services/audioService', () => ({
  audioService: {
    generateUnitAudio: vi.fn(),
    getAudioWithTimestamps: vi.fn(),
  },
  default: undefined,
}));

// Mock AudioPlayer component
vi.mock('@/components/AudioPlayer', () => ({
  default: ({ src, isRtl }: { src: string; isRtl: boolean }) => (
    <div data-testid="audio-player" data-src={src} data-rtl={isRtl.toString()}>
      AudioPlayer Mock
    </div>
  ),
}));

import { audioService } from '@/services/audioService';

describe('UnitAudioButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(audioService.getAudioWithTimestamps).mockResolvedValue(null);
  });

  describe('Language Toggle', () => {
    it('should show both English and Arabic buttons for bilingual content', () => {
      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={true} />);
      expect(screen.getByText(/Listen \(English\)/)).toBeInTheDocument();
      expect(screen.getByText(/استمع \(عربي\)/)).toBeInTheDocument();
    });

    it('should show only English button when no Arabic', () => {
      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={false} />);
      expect(screen.getByText(/Listen/)).toBeInTheDocument();
      expect(screen.queryByText(/استمع/)).not.toBeInTheDocument();
    });

    it('should show only Arabic button when no English', () => {
      render(<UnitAudioButton unitId="unit-1" hasEnglish={false} hasArabic={true} />);
      expect(screen.getByText(/استمع/)).toBeInTheDocument();
      expect(screen.queryByText(/Listen/)).not.toBeInTheDocument();
    });

    it('should show simplified labels when only one language', () => {
      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={false} />);
      // Should be just "Listen" not "Listen (English)"
      expect(screen.getByText('🔊 Listen')).toBeInTheDocument();
    });
  });

  describe('Loading States', () => {
    it('should show loading state when generating audio', async () => {
      vi.mocked(audioService.generateUnitAudio).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={true} />);
      fireEvent.click(screen.getByText(/Listen \(English\)/));

      await waitFor(() => {
        expect(screen.getByText('Generating audio...')).toBeInTheDocument();
      });
    });

    it('should disable button while loading', async () => {
      vi.mocked(audioService.generateUnitAudio).mockImplementation(
        () => new Promise(() => {})
      );

      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={true} />);
      fireEvent.click(screen.getByText(/Listen \(English\)/));

      await waitFor(() => {
        const btn = screen.getByText(/Listen \(English\)/).closest('button');
        expect(btn).toBeDisabled();
      });
    });
  });

  describe('Audio Playback', () => {
    it('should show compact synced controls when timestamps are available', async () => {
      vi.mocked(audioService.getAudioWithTimestamps).mockResolvedValue({
        audioUrl: 'https://api.example.com/audio/unit-1-en.mp3',
        timestamps: [
          { word: 'Hello', offset: 0, duration: 500 },
          { word: 'world', offset: 500, duration: 500 },
        ],
      });

      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={false} />);

      await waitFor(() => {
        expect(audioService.getAudioWithTimestamps).toHaveBeenCalledWith('unit-1', 'en');
      });

      fireEvent.click(screen.getByText('🔊 Listen'));

      await waitFor(() => {
        expect(screen.getByLabelText('Play')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('audio-player')).not.toBeInTheDocument();
    });

    it('should show AudioPlayer on successful generation', async () => {
      vi.mocked(audioService.generateUnitAudio).mockResolvedValue({
        url: 'https://api.example.com/audio/unit-1-en.mp3',
        duration: 30,
      });

      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={true} />);
      fireEvent.click(screen.getByText(/Listen \(English\)/));

      await waitFor(() => {
        expect(screen.getByTestId('audio-player')).toBeInTheDocument();
      });
    });

    it('should set isRtl=true for Arabic audio', async () => {
      vi.mocked(audioService.generateUnitAudio).mockResolvedValue({
        url: 'https://api.example.com/audio/unit-1-ar.mp3',
        duration: 25,
      });

      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={true} />);
      fireEvent.click(screen.getByText(/استمع \(عربي\)/));

      await waitFor(() => {
        const player = screen.getByTestId('audio-player');
        expect(player.getAttribute('data-rtl')).toBe('true');
      });
    });

    it('should cache audio results to avoid re-generation', async () => {
      vi.mocked(audioService.generateUnitAudio).mockResolvedValue({
        url: 'https://api.example.com/audio/unit-1-en.mp3',
        duration: 30,
      });

      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={true} />);

      // First click — generates
      fireEvent.click(screen.getByText(/Listen \(English\)/));
      await waitFor(() => {
        expect(screen.getByTestId('audio-player')).toBeInTheDocument();
      });

      // Close player
      const closeBtn = screen.getByLabelText('Close player');
      fireEvent.click(closeBtn);

      // Second click — should use cache
      fireEvent.click(screen.getByText(/Listen \(English\)/));
      await waitFor(() => {
        expect(screen.getByTestId('audio-player')).toBeInTheDocument();
      });

      // generateUnitAudio should only have been called ONCE
      expect(audioService.generateUnitAudio).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Handling', () => {
    it('should display error message on failure', async () => {
      vi.mocked(audioService.generateUnitAudio).mockRejectedValue(
        new Error('Azure Speech service unavailable')
      );

      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={true} />);
      fireEvent.click(screen.getByText(/Listen \(English\)/));

      await waitFor(() => {
        expect(screen.getByText('Azure Speech service unavailable')).toBeInTheDocument();
      });
    });

    it('should show dismiss button on error', async () => {
      vi.mocked(audioService.generateUnitAudio).mockRejectedValue(
        new Error('Network error')
      );

      render(<UnitAudioButton unitId="unit-1" hasEnglish={true} hasArabic={true} />);
      fireEvent.click(screen.getByText(/Listen \(English\)/));

      await waitFor(() => {
        expect(screen.getByLabelText('Dismiss error')).toBeInTheDocument();
      });
    });
  });
});
