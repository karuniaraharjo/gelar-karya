"use client";

import {
  Button,
  Card,
  Skeleton,
  Badge,
  CategoryCircle,
  EmptyState,
  ErrorState,
} from "@/components/ui";

/* ------------------------------------------------------------------ */
/*  Color swatch helper                                                */
/* ------------------------------------------------------------------ */
function ColorSwatch({
  token,
  hex,
  label,
}: {
  token: string;
  hex: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-[var(--radius-md)] border border-border-subtle shrink-0"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div>
        <p className="text-xs font-mono text-text-primary">{token}</p>
        <p className="text-[10px] text-text-secondary">
          {hex} — {label}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section wrapper                                                    */
/* ------------------------------------------------------------------ */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-[20px] leading-7 font-semibold text-text-primary border-b border-border-subtle pb-2">
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Style Guide Page                                                   */
/* ------------------------------------------------------------------ */
export default function StyleGuidePage() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      {/* Header */}
      <header className="border-b border-border-subtle bg-bg-elevated sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <h1 className="text-[24px] leading-8 font-bold">
            <span className="bg-accent-gradient bg-clip-text text-transparent">
              KaryaFeed
            </span>{" "}
            Style Guide
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Stage 2 — Design System & Komponen UI Dasar (development only)
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-14">
        {/* ============================================================ */}
        {/*  §3.2 COLOR PALETTE                                          */}
        {/* ============================================================ */}
        <Section title="§3.2 Color Palette">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ColorSwatch token="--bg-base" hex="#0B0B0F" label="Background utama" />
            <ColorSwatch token="--bg-elevated" hex="#16161C" label="Card, nav, top bar" />
            <ColorSwatch token="--border-subtle" hex="#2A2A32" label="Divider, outline" />
            <ColorSwatch token="--text-primary" hex="#F5F5F7" label="Teks utama" />
            <ColorSwatch token="--text-secondary" hex="#9A9AA5" label="Metadata, deskripsi" />
            <ColorSwatch token="--accent-primary" hex="#6C5CE7" label="CTA, tab aktif" />
            <ColorSwatch token="--danger" hex="#FF5C5C" label="Error" />
            <ColorSwatch token="--success" hex="#2ED573" label="Sukses" />
          </div>
          {/* Gradient swatch */}
          <div className="flex items-center gap-3 mt-2">
            <div
              className="w-24 h-10 rounded-[var(--radius-md)] bg-accent-gradient"
            />
            <div>
              <p className="text-xs font-mono text-text-primary">
                --accent-gradient
              </p>
              <p className="text-[10px] text-text-secondary">
                135deg, #6C5CE7 → #00D9C0 — Ring kategori, highlight
              </p>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  §3.3 TYPOGRAPHY                                             */}
        {/* ============================================================ */}
        <Section title="§3.3 Typography Scale">
          <div className="space-y-3 bg-bg-elevated border border-border-subtle rounded-[var(--radius-lg)] p-6">
            <div>
              <span className="text-[10px] text-text-secondary font-mono block mb-0.5">
                H1 — 24/32
              </span>
              <h1 className="text-[24px] leading-8 font-bold">
                Galeri Karya Mahasiswa
              </h1>
            </div>
            <div>
              <span className="text-[10px] text-text-secondary font-mono block mb-0.5">
                H2 — 20/28
              </span>
              <h2 className="text-[20px] leading-7 font-semibold">
                Jelajahi Proyek Terbaru
              </h2>
            </div>
            <div>
              <span className="text-[10px] text-text-secondary font-mono block mb-0.5">
                Body — 14/20
              </span>
              <p className="text-[14px] leading-5">
                Aplikasi manajemen slot parkir berbasis IoT dan computer vision
                untuk efisiensi penggunaan lahan parkir kampus.
              </p>
            </div>
            <div>
              <span className="text-[10px] text-text-secondary font-mono block mb-0.5">
                Caption — 12/16
              </span>
              <p className="text-[12px] leading-4 text-text-secondary">
                S1 Informatika · Angkatan 2025 · 342 views
              </p>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  BUTTON                                                      */}
        {/* ============================================================ */}
        <Section title="Button">
          <p className="text-sm text-text-secondary">
            Variant: primary / secondary / ghost — State: default / loading /
            disabled — Size: sm / md / lg
          </p>

          {/* All variants × default state */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-text-secondary">
              Default state
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">Primary SM</Button>
              <Button variant="primary" size="md">Primary MD</Button>
              <Button variant="primary" size="lg">Primary LG</Button>
              <Button variant="secondary" size="md">Secondary</Button>
              <Button variant="ghost" size="md">Ghost</Button>
            </div>
          </div>

          {/* Loading state */}
          <div className="space-y-4 mt-6">
            <h3 className="text-sm font-medium text-text-secondary">
              Loading state
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" isLoading>
                Menyimpan…
              </Button>
              <Button variant="secondary" isLoading>
                Memuat…
              </Button>
              <Button variant="ghost" isLoading>
                Loading…
              </Button>
            </div>
          </div>

          {/* Disabled state */}
          <div className="space-y-4 mt-6">
            <h3 className="text-sm font-medium text-text-secondary">
              Disabled state
            </h3>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="secondary" disabled>
                Disabled
              </Button>
              <Button variant="ghost" disabled>
                Disabled
              </Button>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  CARD                                                        */}
        {/* ============================================================ */}
        <Section title="Card">
          <p className="text-sm text-text-secondary mb-2">
            Pondasi untuk KaryaCard (Stage 4). Padding: none / sm / md / lg.
            Hoverable: subtle lift on hover.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card padding="md">
              <h3 className="text-sm font-semibold mb-1">Card Default (md padding)</h3>
              <p className="text-xs text-text-secondary">
                Ini adalah card dasar dengan border subtle dan elevated background.
              </p>
            </Card>
            <Card padding="md" hoverable>
              <h3 className="text-sm font-semibold mb-1">Card Hoverable</h3>
              <p className="text-xs text-text-secondary">
                Hover untuk melihat efek lift. Transisi mematuhi prefers-reduced-motion.
              </p>
            </Card>
            <Card padding="lg">
              <h3 className="text-sm font-semibold mb-1">Card Large Padding</h3>
              <p className="text-xs text-text-secondary">
                Padding lebih besar untuk konten yang butuh ruang bernapas.
              </p>
            </Card>
            <Card padding="none">
              <div className="h-24 bg-bg-skeleton flex items-center justify-center">
                <span className="text-xs text-text-secondary">Image area (no padding)</span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-1">Card No Padding</h3>
                <p className="text-xs text-text-secondary">
                  Berguna untuk kartu dengan gambar full-bleed di atas.
                </p>
              </div>
            </Card>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  SKELETON                                                    */}
        {/* ============================================================ */}
        <Section title="Skeleton (§3.5 Loading State)">
          <p className="text-sm text-text-secondary mb-2">
            Shimmer animation, bukan spinner. Variant: line / circle / rect / card.
            Animasi dihentikan saat prefers-reduced-motion aktif.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Lines */}
            <div>
              <h3 className="text-xs font-medium text-text-secondary mb-3">
                Lines (3 baris)
              </h3>
              <Skeleton variant="line" lines={3} />
            </div>

            {/* Circle */}
            <div>
              <h3 className="text-xs font-medium text-text-secondary mb-3">
                Circle
              </h3>
              <div className="flex gap-3">
                <Skeleton variant="circle" width="40px" height="40px" />
                <Skeleton variant="circle" />
                <Skeleton variant="circle" width="56px" height="56px" />
              </div>
            </div>

            {/* Rect */}
            <div>
              <h3 className="text-xs font-medium text-text-secondary mb-3">
                Rect
              </h3>
              <Skeleton variant="rect" height="120px" />
            </div>

            {/* Card */}
            <div>
              <h3 className="text-xs font-medium text-text-secondary mb-3">
                Card (preset)
              </h3>
              <Skeleton variant="card" />
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  BADGE                                                       */}
        {/* ============================================================ */}
        <Section title="Badge / Chip">
          <p className="text-sm text-text-secondary mb-2">
            Untuk label kategori & tech stack. Variant: default / outline / solid. Size: sm / md.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-medium text-text-secondary mb-2">
                Default (muted accent)
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge>React</Badge>
                <Badge>TypeScript</Badge>
                <Badge>Next.js</Badge>
                <Badge>Tailwind CSS</Badge>
                <Badge>IoT</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-secondary mb-2">
                Outline
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Python</Badge>
                <Badge variant="outline">OpenCV</Badge>
                <Badge variant="outline">ESP32</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-secondary mb-2">
                Solid
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="solid">Web</Badge>
                <Badge variant="solid">Mobile</Badge>
                <Badge variant="solid">AI/ML</Badge>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-secondary mb-2">
                Size comparison (sm vs md)
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                <Badge size="sm">SM badge</Badge>
                <Badge size="md">MD badge</Badge>
                <Badge variant="solid" size="sm">SM solid</Badge>
                <Badge variant="solid" size="md">MD solid</Badge>
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  CATEGORY CIRCLE                                             */}
        {/* ============================================================ */}
        <Section title="CategoryCircle (§3.4 Top Bar Kategori)">
          <p className="text-sm text-text-secondary mb-2">
            Lingkaran dengan gradient ring. Active: glow accent. Inactive: muted border.
            Size: sm / md / lg.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-medium text-text-secondary mb-3">
                Active & Inactive states (md)
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2">
                <CategoryCircle label="Web" isActive />
                <CategoryCircle label="Mobile" />
                <CategoryCircle label="AI/ML" isActive />
                <CategoryCircle label="Game" />
                <CategoryCircle label="IoT" />
                <CategoryCircle label="UI/UX" />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-medium text-text-secondary mb-3">
                Size comparison
              </h3>
              <div className="flex items-end gap-4">
                <CategoryCircle label="SM" size="sm" isActive />
                <CategoryCircle label="MD" size="md" isActive />
                <CategoryCircle label="LG" size="lg" isActive />
              </div>
            </div>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  EMPTY STATE                                                 */}
        {/* ============================================================ */}
        <Section title="EmptyState (§3.5)">
          <p className="text-sm text-text-secondary mb-2">
            Ilustrasi ringan + teks informatif + CTA opsional. Tidak ada data teknis.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card padding="none">
              <EmptyState
                title="Belum ada karya"
                description="Belum ada karya di kategori ini. Coba lihat kategori lainnya."
                actionLabel="Lihat semua kategori"
                onAction={() => alert("Navigasi ke semua kategori")}
              />
            </Card>
            <Card padding="none">
              <EmptyState
                title="Hasil pencarian kosong"
                description="Tidak ada karya yang cocok dengan filter yang kamu pilih."
              />
            </Card>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  ERROR STATE                                                 */}
        {/* ============================================================ */}
        <Section title="ErrorState (§3.5)">
          <p className="text-sm text-text-secondary mb-2">
            Pesan singkat + tombol &ldquo;Coba Lagi&rdquo;. Tidak menampilkan stack trace.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card padding="none">
              <ErrorState
                message="Gagal memuat data karya. Periksa koneksi internet kamu dan coba lagi."
                onRetry={() => alert("Retry triggered")}
              />
            </Card>
            <Card padding="none">
              <ErrorState
                title="Server Error"
                message="Terjadi masalah pada server kami. Tim kami sudah diberitahu."
                onRetry={() => alert("Retry triggered")}
                retryLabel="Muat Ulang"
              />
            </Card>
          </div>
        </Section>

        {/* ============================================================ */}
        {/*  ACCESSIBILITY NOTE                                          */}
        {/* ============================================================ */}
        <Section title="§3.6 Aksesibilitas & Motion">
          <Card padding="lg">
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-success font-bold text-lg">✓</span>
                <div>
                  <p className="font-medium">Kontras WCAG AA</p>
                  <p className="text-text-secondary text-xs">
                    --text-primary (#F5F5F7) vs --bg-base (#0B0B0F) = ~18:1 ·
                    --text-secondary (#9A9AA5) vs --bg-base = ~6.3:1 ·
                    --text-secondary vs --bg-elevated (#16161C) = ~5.3:1
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-success font-bold text-lg">✓</span>
                <div>
                  <p className="font-medium">prefers-reduced-motion</p>
                  <p className="text-text-secondary text-xs">
                    Semua animasi (shimmer skeleton, hover transition) di-disable
                    secara global via media query di globals.css.
                    Toggle di DevTools → Rendering → Emulate CSS media feature.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-success font-bold text-lg">✓</span>
                <div>
                  <p className="font-medium">ARIA attributes</p>
                  <p className="text-text-secondary text-xs">
                    Button: aria-busy saat loading · CategoryCircle: aria-pressed ·
                    ErrorState: role=&quot;alert&quot; · EmptyState: role=&quot;status&quot; ·
                    Skeleton: aria-hidden=&quot;true&quot;
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-success font-bold text-lg">✓</span>
                <div>
                  <p className="font-medium">CSS Variable Tokens</p>
                  <p className="text-text-secondary text-xs">
                    Semua komponen menggunakan var(--token) via Tailwind theme,
                    tidak ada hex hardcode di komponen.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </Section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-10 py-6">
        <p className="text-center text-xs text-text-secondary">
          KaryaFeed Style Guide · Stage 2/13 · Development only
        </p>
      </footer>
    </div>
  );
}
