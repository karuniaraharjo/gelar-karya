import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DetailErrorState } from "@/components/features/karya/DetailErrorState";
import { MediaCarousel } from "@/components/features/karya/MediaCarousel";
import { ShareButton } from "@/components/features/karya/ShareButton";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ExternalLink, GitBranch, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { ViewTracker } from "./view-tracker";

export const revalidate = 60; // ISR revalidate every 60s

type PageProps = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: karya } = await supabase
    .from("karya")
    .select("judul, deskripsi")
    .eq("id", id)
    .single();

  if (!karya) return { title: "Karya Tidak Ditemukan" };

  return {
    title: `${karya.judul} | KaryaFeed`,
    description: karya.deskripsi,
  };
}

export default async function KaryaDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: karya, error } = await supabase
    .from("karya")
    .select(`
      *,
      kategori:kategori_id(nama, slug),
      angkatan:angkatan_id(label, tahun),
      karya_media(id, url, tipe, thumbnail_url, urutan),
      karya_tech_stack(tech_stack(nama))
    `)
    .eq("id", id)
    .single();

  if (error || !karya) {
    if (error?.code === "PGRST116" || error?.code === "22P02") {
      // 404 Not Found or Invalid UUID format
      return <DetailErrorState message="Karya yang Anda cari tidak ditemukan atau telah dihapus." />;
    }
    return <DetailErrorState message={`Terjadi kesalahan saat memuat data: ${error?.message || "Unknown error"}`} />;
  }

  if (karya.status !== "published") {
    return <DetailErrorState message="Karya ini belum dipublikasikan." />;
  }

  const mediaList = karya.karya_media?.sort((a: any, b: any) => a.urutan - b.urutan) || [];
  const techStacks = karya.karya_tech_stack?.map((ts: any) => ts.tech_stack?.nama).filter(Boolean) || [];

  return (
    <div className="flex flex-col min-h-[calc(100vh-176px)]">
      <ViewTracker karyaId={karya.id} />
      {/* Container to restrict max width on desktop but full on mobile */}
      <div className="w-full max-w-2xl mx-auto bg-bg-elevated flex-1 shadow-lg border-x border-border-subtle">
        
        {/* Top Header / Back Navigation */}
        <div className="px-4 py-3 flex items-center border-b border-border-subtle bg-bg-elevated/80 backdrop-blur-md sticky top-16 z-30">
          <Link href="/home" className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium text-sm">Kembali</span>
          </Link>
        </div>

        {/* Media Carousel */}
        <div className="w-full aspect-[4/3] bg-black">
          <MediaCarousel media={mediaList} />
        </div>

        {/* Main Content */}
        <div className="p-5">
          <div className="flex justify-between items-start gap-4 mb-4">
            <h1 className="text-2xl font-bold text-text-primary leading-tight">
              {karya.judul}
            </h1>
            <ShareButton title={karya.judul} url={`/karya/${karya.id}`} />
          </div>

          {/* Meta Information Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="solid" className="bg-accent-primary">{karya.kategori?.nama || "Kategori"}</Badge>
            <Badge variant="outline">{karya.angkatan?.label || "Angkatan"}</Badge>
          </div>

          {/* Details Box */}
          <div className="bg-bg-base rounded-[var(--radius-lg)] p-4 border border-border-subtle mb-6 space-y-3 text-sm">
            <div className="flex justify-between border-b border-border-subtle pb-2">
              <span className="text-text-secondary">Mahasiswa</span>
              <span className="font-medium text-text-primary text-right">
                {karya.nama_mahasiswa} {karya.nim ? `(${karya.nim})` : ""}
              </span>
            </div>
            {karya.prodi && (
              <div className="flex justify-between border-b border-border-subtle pb-2">
                <span className="text-text-secondary">Program Studi</span>
                <span className="font-medium text-text-primary text-right">{karya.prodi}</span>
              </div>
            )}
            {karya.dosen_pembimbing && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Dosen Pembimbing</span>
                <span className="font-medium text-text-primary text-right">{karya.dosen_pembimbing}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-text-primary mb-3">Deskripsi</h2>
            <div className="text-text-secondary whitespace-pre-wrap leading-relaxed text-sm">
              {karya.deskripsi}
            </div>
          </div>

          {/* Tech Stack */}
          {techStacks.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-text-primary mb-3">Teknologi</h2>
              <div className="flex flex-wrap gap-2">
                {techStacks.map((tech: string, i: number) => (
                  <Badge key={i} variant="outline" className="bg-bg-base">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* External Links */}
          {(karya.link_demo || karya.link_github) && (
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-border-subtle">
              {karya.link_demo && (
                <Link
                  href={karya.link_demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-accent-primary text-white font-medium hover:bg-accent-primary-hover transition-colors"
                >
                  <ExternalLink size={18} />
                  Lihat Demo
                </Link>
              )}
              {karya.link_github && (
                <Link
                  href={karya.link_github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-[var(--radius-md)] bg-transparent text-text-primary border border-border-subtle font-medium hover:border-text-primary transition-colors"
                >
                  <GitBranch size={18} />
                  Lihat GitHub
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
