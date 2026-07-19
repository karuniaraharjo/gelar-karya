export default function Home() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        <h1 className="text-4xl font-bold">KaryaFeed - PWA Showcase</h1>
        <p className="text-text-secondary text-lg">
          Platform Galeri Digital Karya Mahasiswa Informatika
        </p>
        
        <div className="p-6 bg-bg-elevated border border-border-subtle rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 bg-accent-gradient bg-clip-text text-transparent">
            Design Token & Tailwind Config Test
          </h2>
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="p-3 bg-bg-base rounded border border-border-subtle">
              <span className="text-text-secondary text-sm block mb-1">Accent Primary</span>
              <div className="h-2 w-full bg-accent-primary rounded"></div>
            </div>
            <div className="p-3 bg-bg-base rounded border border-border-subtle">
              <span className="text-text-secondary text-sm block mb-1">Accent Gradient</span>
              <div className="h-2 w-full bg-accent-gradient rounded"></div>
            </div>
            <div className="p-3 bg-bg-base rounded border border-border-subtle">
              <span className="text-text-secondary text-sm block mb-1">Success</span>
              <div className="h-2 w-full bg-success rounded"></div>
            </div>
            <div className="p-3 bg-bg-base rounded border border-border-subtle">
              <span className="text-text-secondary text-sm block mb-1">Danger</span>
              <div className="h-2 w-full bg-danger rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
