import { describe, it, expect, vi } from 'vitest';
import { fetchFeedKarya, fetchExploreKarya } from '../karya';
import { SupabaseClient } from '@supabase/supabase-js';

describe('API Karya', () => {
  const createMockSupabase = (mockData: any) => {
    const mockQuery: any = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      then: vi.fn((resolve) => resolve({ data: mockData, error: null })),
    };
    
    // Make sure await works on the query
    mockQuery.then = (resolve: any) => resolve({ data: mockData, error: null });

    const mockClient = {
      from: vi.fn().mockReturnValue(mockQuery),
    };

    return { mockClient: mockClient as unknown as SupabaseClient, mockQuery };
  };

  describe('fetchFeedKarya', () => {
    it('applies category filter when activeCategory is provided', async () => {
      const mockData = [
        {
          id: '1',
          judul: 'Karya 1',
          kategori: { nama: 'IoT', slug: 'iot' },
        }
      ];
      const { mockClient, mockQuery } = createMockSupabase(mockData);

      const result = await fetchFeedKarya(mockClient, { activeCategory: 'iot' });
      
      expect(mockClient.from).toHaveBeenCalledWith('karya');
      expect(mockQuery.eq).toHaveBeenCalledWith('status', 'published');
      expect(mockQuery.eq).toHaveBeenCalledWith('kategori.slug', 'iot');
      expect(result.length).toBe(1);
    });

    it('throws error when supabase query fails', async () => {
      const { mockClient } = createMockSupabase([]);
      // Override the then method to simulate error
      (mockClient.from as any)().then = (resolve: any) => resolve({ data: null, error: { message: 'DB Error' } });

      await expect(fetchFeedKarya(mockClient, {})).rejects.toThrow('DB Error');
    });

    it('applies pagination cursor when pageParam is provided', async () => {
      const { mockClient, mockQuery } = createMockSupabase([]);

      await fetchFeedKarya(mockClient, { pageParam: '2026-07-01T00:00:00Z' });
      
      expect(mockQuery.lt).toHaveBeenCalledWith('created_at', '2026-07-01T00:00:00Z');
    });
  });

  describe('fetchExploreKarya', () => {
    it('applies pagination cursor when pageParam is provided', async () => {
      const { mockClient, mockQuery } = createMockSupabase([]);

      await fetchExploreKarya(mockClient, { pageParam: '2026-07-01T00:00:00Z' });
      
      expect(mockQuery.lt).toHaveBeenCalledWith('created_at', '2026-07-01T00:00:00Z');
      expect(mockQuery.limit).toHaveBeenCalledWith(30);
    });

    it('throws error when supabase query fails', async () => {
      const { mockClient } = createMockSupabase([]);
      (mockClient.from as any)().then = (resolve: any) => resolve({ data: null, error: { message: 'DB Error 2' } });

      await expect(fetchExploreKarya(mockClient, {})).rejects.toThrow('DB Error 2');
    });
  });
});
