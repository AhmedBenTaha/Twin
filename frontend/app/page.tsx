
import Twin from "@/components/twin";

export default function Home() {
  return (
    <main className="twin-background relative min-h-screen overflow-hidden">
      <div className="ambient-grid pointer-events-none absolute inset-0" />

      <div className="relative z-10 min-h-screen">
        <Twin />
      </div>
    </main>
  );
}
