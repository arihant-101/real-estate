export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-2xl items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" aria-hidden />
        <p className="text-sm text-muted">Loading…</p>
      </div>
    </div>
  );
}
