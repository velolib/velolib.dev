export function SiteBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 bottom-0 -z-10 overflow-hidden"
    >
      <div className="bg-topo absolute inset-0" />
      <div className="bg-grain absolute inset-0" />
    </div>
  )
}
