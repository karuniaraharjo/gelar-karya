import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ExploreGrid } from '../ExploreGrid';
import { useInfiniteQuery } from '@tanstack/react-query';

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
    inView: false,
  }),
}));

// Mock supabase client
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(),
}));

// Mock react-query
vi.mock('@tanstack/react-query', () => ({
  useInfiniteQuery: vi.fn(),
}));

describe('ExploreGrid', () => {
  it('renders skeleton when pending', () => {
    vi.mocked(useInfiniteQuery).mockReturnValue({
      status: 'pending',
      data: undefined,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    const { container } = render(<ExploreGrid />);
    
    // Skeleton items should be present (12 items based on code)
    const skeletons = container.querySelectorAll('.bg-bg-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders empty state when no items', () => {
    vi.mocked(useInfiniteQuery).mockReturnValue({
      status: 'success',
      data: { pages: [] },
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<ExploreGrid />);
    expect(screen.getByText('Belum Ada Karya')).toBeInTheDocument();
  });

  it('renders grid items correctly', () => {
    const mockData = {
      pages: [
        [
          { id: '1', thumbnailUrl: '/mock1.webp', kategori: { nama: 'Web' }, createdAt: '2026-07-01' },
          { id: '2', thumbnailUrl: '/mock2.webp', kategori: { nama: 'IoT' }, createdAt: '2026-07-02' }
        ]
      ]
    };

    vi.mocked(useInfiniteQuery).mockReturnValue({
      status: 'success',
      data: mockData,
      error: null,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
    } as any);

    render(<ExploreGrid />);
    
    expect(screen.getAllByAltText('Thumbnail').length).toBeGreaterThan(0);
    
    // By checking image sources
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute('src', '/mock1.webp');
    expect(images[1]).toHaveAttribute('src', '/mock2.webp');
    
    // Categories should be visible
    expect(screen.getByText('Web')).toBeInTheDocument();
    expect(screen.getByText('IoT')).toBeInTheDocument();
  });
});
