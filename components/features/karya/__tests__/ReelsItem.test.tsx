import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ReelsItem } from '../ReelsItem';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    return <img {...props} />;
  },
}));

// Mock react-intersection-observer
vi.mock('react-intersection-observer', () => ({
  useInView: () => ({
    ref: vi.fn(),
    inView: true,
  }),
}));

describe('ReelsItem', () => {
  const mockImageProps = {
    id: '1',
    judul: 'Karya Image',
    namaMahasiswa: 'Alice',
    media: { url: '/mock-image.webp', tipe: 'image' },
  };

  const mockVideoProps = {
    id: '2',
    judul: 'Karya Video',
    namaMahasiswa: 'Bob',
    media: { url: '/mock-video.mp4', tipe: 'video', thumbnail_url: '/mock-poster.webp' },
  };

  it('renders image reel correctly', () => {
    render(<ReelsItem {...mockImageProps} />);
    
    expect(screen.getByText('Karya Image')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    
    const image = screen.getByAltText('Karya Image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/mock-image.webp');
  });

  it('renders video reel correctly and toggles mute', () => {
    render(<ReelsItem {...mockVideoProps} />);
    
    expect(screen.getByText('Karya Video')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    
    // Video should be rendered
    const video = document.querySelector('video');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', '/mock-video.mp4');
    expect(video).toHaveAttribute('poster', '/mock-poster.webp');
    
    // Initially muted
    const muteBtn = screen.getByRole('button', { name: /unmute/i });
    expect(muteBtn).toBeInTheDocument();
    
    // Click to unmute
    fireEvent.click(muteBtn);
    expect(screen.getByRole('button', { name: /mute/i })).toBeInTheDocument();
  });

  it('toggles play state on click', () => {
    render(<ReelsItem {...mockVideoProps} />);
    
    // Find the container to click on (it has role="button" or we can just click the div)
    // The div doesn't have a role, but we can click the first element
    const container = screen.getByText('Karya Video').closest('div')?.parentElement?.parentElement;
    if (container) {
      fireEvent.click(container);
    }
    
    // Play button overlay should appear when paused
    // Actually the overlay contains the Play icon from lucide-react, so we can check if it exists
    // The play overlay is an SVG within a div
    const playIcon = document.querySelector('.lucide-play');
    expect(playIcon).toBeInTheDocument();
  });
});
