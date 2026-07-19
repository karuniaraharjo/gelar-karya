import { z } from 'zod'

export const mediaSchema = z.object({
  id: z.string().optional(),
  karya_id: z.string().optional(),
  tipe: z.enum(['image', 'video']),
  url: z.string().url("URL media tidak valid"),
  thumbnail_url: z.string().url("URL thumbnail tidak valid").optional().nullable(),
  alt_text: z.string().optional().nullable(),
  urutan: z.number().int().nonnegative(),
  
  // File object is only for client-side upload handling before submission
  // It won't be sent to server validation, but we can define it optionally
  file: z.any().optional(),
})

export const karyaFormSchema = z.object({
  id: z.string().optional(),
  judul: z.string().min(3, "Judul minimal 3 karakter"),
  deskripsi: z.string().min(10, "Deskripsi minimal 10 karakter"),
  nama_mahasiswa: z.string().min(2, "Nama mahasiswa wajib diisi"),
  nim: z.string().optional(),
  tampilkan_nim: z.boolean().default(false),
  prodi: z.string().optional(),
  kategori_id: z.string().min(1, "Kategori wajib dipilih"),
  angkatan_id: z.string().min(1, "Angkatan wajib dipilih"),
  dosen_pembimbing: z.string().optional(),
  link_demo: z.union([z.literal(''), z.string().url("Link demo harus berupa URL yang valid")]).optional(),
  link_github: z.union([z.literal(''), z.string().url("Link GitHub harus berupa URL yang valid")]).optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  media: z.array(mediaSchema).min(1, "Minimal harus ada 1 media"),
  tech_stacks: z.array(z.string()).optional(), // Array of tech stack IDs
  version: z.number().optional(), // For optimistic locking
  idempotency_key: z.string().optional() // Generated on client
})

export type KaryaFormValues = z.infer<typeof karyaFormSchema>
export type MediaItem = z.infer<typeof mediaSchema>
