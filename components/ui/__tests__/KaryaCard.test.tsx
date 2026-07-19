import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { KaryaCard } from '../KaryaCard';

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: any) => {
    return <img {...props} />;
  },
}));

describe('KaryaCard', () => {
  const mockProps = {
    id: '123',
    judul: 'SIMAP - Sistem Informasi',
    namaMahasiswa: 'Budi Santoso',
    prodi: 'S1 Informatika',
    kategori: 'IoT',
    thumbnailUrl: '/mock.webp',
    viewCount: 342,
  };

  it('renders correctly with given props', () => {
    render(<KaryaCard {...mockProps} />);
    
    expect(screen.getByText('SIMAP - Sistem Informasi')).toBeInTheDocument();
    expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
    expect(screen.getByText('S1 Informatika')).toBeInTheDocument();
    expect(screen.getByText('IoT')).toBeInTheDocument();
    expect(screen.getByText('342 tayangan')).toBeInTheDocument();
    
    const image = screen.getByAltText('Thumbnail untuk SIMAP - Sistem Informasi');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/mock.webp');
  });

  it('renders without prodi if not provided', () => {
    render(<KaryaCard {...mockProps} prodi={null} />);
    
    expect(screen.getByText('SIMAP - Sistem Informasi')).toBeInTheDocument();
    expect(screen.getByText('Budi Santoso')).toBeInTheDocument();
    expect(screen.queryByText('S1 Informatika')).not.toBeInTheDocument();
  });
});
