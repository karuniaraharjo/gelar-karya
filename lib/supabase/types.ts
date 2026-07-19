export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      angkatan: {
        Row: {
          created_at: string
          id: string
          label: string
          tahun: number
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          tahun: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          tahun?: number
        }
        Relationships: []
      }
      karya: {
        Row: {
          angkatan_id: string | null
          created_at: string
          created_by: string | null
          deskripsi: string
          dosen_pembimbing: string | null
          id: string
          judul: string
          kategori_id: string | null
          like_count: number
          link_demo: string | null
          link_github: string | null
          nama_mahasiswa: string
          nim: string | null
          prodi: string | null
          status: string
          updated_at: string
          version: number
          view_count: number
        }
        Insert: {
          angkatan_id?: string | null
          created_at?: string
          created_by?: string | null
          deskripsi: string
          dosen_pembimbing?: string | null
          id?: string
          judul: string
          kategori_id?: string | null
          like_count?: number
          link_demo?: string | null
          link_github?: string | null
          nama_mahasiswa: string
          nim?: string | null
          prodi?: string | null
          status?: string
          updated_at?: string
          version?: number
          view_count?: number
        }
        Update: {
          angkatan_id?: string | null
          created_at?: string
          created_by?: string | null
          deskripsi?: string
          dosen_pembimbing?: string | null
          id?: string
          judul?: string
          kategori_id?: string | null
          like_count?: number
          link_demo?: string | null
          link_github?: string | null
          nama_mahasiswa?: string
          nim?: string | null
          prodi?: string | null
          status?: string
          updated_at?: string
          version?: number
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "karya_angkatan_id_fkey"
            columns: ["angkatan_id"]
            isOneToOne: false
            referencedRelation: "angkatan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "karya_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "karya_kategori_id_fkey"
            columns: ["kategori_id"]
            isOneToOne: false
            referencedRelation: "kategori"
            referencedColumns: ["id"]
          }
        ]
      }
      karya_media: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          karya_id: string
          thumbnail_url: string | null
          tipe: string
          urutan: number
          url: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          karya_id: string
          thumbnail_url?: string | null
          tipe: string
          urutan?: number
          url: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          karya_id?: string
          thumbnail_url?: string | null
          tipe?: string
          urutan?: number
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "karya_media_karya_id_fkey"
            columns: ["karya_id"]
            isOneToOne: false
            referencedRelation: "karya"
            referencedColumns: ["id"]
          }
        ]
      }
      karya_tech_stack: {
        Row: {
          karya_id: string
          tech_stack_id: string
        }
        Insert: {
          karya_id: string
          tech_stack_id: string
        }
        Update: {
          karya_id?: string
          tech_stack_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "karya_tech_stack_karya_id_fkey"
            columns: ["karya_id"]
            isOneToOne: false
            referencedRelation: "karya"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "karya_tech_stack_tech_stack_id_fkey"
            columns: ["tech_stack_id"]
            isOneToOne: false
            referencedRelation: "tech_stack"
            referencedColumns: ["id"]
          }
        ]
      }
      karya_view_log: {
        Row: {
          created_at: string
          id: number
          karya_id: string | null
          session_hash: string
        }
        Insert: {
          created_at?: string
          id?: number
          karya_id?: string | null
          session_hash: string
        }
        Update: {
          created_at?: string
          id?: number
          karya_id?: string | null
          session_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "karya_view_log_karya_id_fkey"
            columns: ["karya_id"]
            isOneToOne: false
            referencedRelation: "karya"
            referencedColumns: ["id"]
          }
        ]
      }
      kategori: {
        Row: {
          created_at: string
          icon_url: string | null
          id: string
          nama: string
          slug: string
          urutan: number
        }
        Insert: {
          created_at?: string
          icon_url?: string | null
          id?: string
          nama: string
          slug: string
          urutan?: number
        }
        Update: {
          created_at?: string
          icon_url?: string | null
          id?: string
          nama?: string
          slug?: string
          urutan?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          nama: string | null
          role: string
        }
        Insert: {
          created_at?: string
          id: string
          nama?: string | null
          role?: string
        }
        Update: {
          created_at?: string
          id?: string
          nama?: string | null
          role?: string
        }
        Relationships: []
      }
      tech_stack: {
        Row: {
          id: string
          nama: string
        }
        Insert: {
          id?: string
          nama: string
        }
        Update: {
          id?: string
          nama?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
