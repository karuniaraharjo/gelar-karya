import { describe, it, expect } from 'vitest';
import { karyaFormSchema } from '../karya';

describe('karyaFormSchema', () => {
  it('validates a correct payload', () => {
    const validData = {
      judul: 'Proyek IoT Smart Home',
      deskripsi: 'Sistem otomasi rumah berbasis ESP32',
      nama_mahasiswa: 'Budi',
      kategori_id: 'cat-123',
      angkatan_id: 'angkatan-123',
      status: 'draft',
      media: [
        { tipe: 'image', url: 'https://example.com/img.jpg', urutan: 0 }
      ],
    };

    const result = karyaFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects if judul is too short', () => {
    const invalidData = {
      judul: 'ab', // min 3
      deskripsi: 'Sistem otomasi rumah berbasis ESP32',
      nama_mahasiswa: 'Budi',
      kategori_id: 'cat-123',
      angkatan_id: 'angkatan-123',
      media: [{ tipe: 'image', url: 'https://example.com/img.jpg', urutan: 0 }],
    };

    const result = karyaFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Judul minimal 3 karakter');
    }
  });

  it('rejects if no media is provided', () => {
    const invalidData = {
      judul: 'Proyek Valid',
      deskripsi: 'Deskripsi panjang minimal sepuluh karakter',
      nama_mahasiswa: 'Budi',
      kategori_id: 'cat-123',
      angkatan_id: 'angkatan-123',
      media: [], // min 1
    };

    const result = karyaFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Minimal harus ada 1 media');
    }
  });

  it('rejects invalid urls', () => {
    const invalidData = {
      judul: 'Proyek Valid',
      deskripsi: 'Deskripsi panjang minimal sepuluh karakter',
      nama_mahasiswa: 'Budi',
      kategori_id: 'cat-123',
      angkatan_id: 'angkatan-123',
      link_demo: 'not-a-url',
      media: [{ tipe: 'image', url: 'https://example.com/img.jpg', urutan: 0 }],
    };

    const result = karyaFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Link demo harus berupa URL yang valid');
    }
  });
});
