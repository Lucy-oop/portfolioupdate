/**
 * Live, pannable Figma prototype.
 *
 * This works off the FILE's own link sharing, not any API access — the file
 * must be set to Share -> "Anyone with the link" or visitors see a permission
 * error inside the iframe.
 */
export default function FigmaEmbed({ url, title }: { url: string; title: string }) {
  const src = `https://embed.figma.com/design/${extractPath(url)}&embed-host=portfolio`

  return (
    <div className="overflow-hidden rounded-tile border border-line bg-canvas-sunk">
      <iframe
        title={`${title} — Figma file`}
        src={src}
        allowFullScreen
        loading="lazy"
        className="block h-[520px] w-full border-0"
      />
    </div>
  )
}

/** Turns a figma.com/design/<key>/<name>?node-id=… URL into the embed path. */
function extractPath(url: string): string {
  const match = url.match(/figma\.com\/design\/([^?#]+)/)
  const path = match ? match[1] : url
  const nodeId = url.match(/node-id=([^&]+)/)?.[1]
  return nodeId ? `${path}?node-id=${nodeId}` : `${path}?`
}
