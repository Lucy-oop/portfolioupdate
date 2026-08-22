import { useInViewOnce } from '../../lib/useInViewOnce'

type MeterProps = {
  label: string
  /** 0–100. Drives bar width only; `note` carries the real meaning. */
  value: number
  note: string
}

export default function Meter({ label, value, note }: MeterProps) {
  const { ref, inView } = useInViewOnce<HTMLDivElement>()

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[15px] font-medium">{label}</span>
        <span className="font-mono text-[11px] text-muted">{note}</span>
      </div>

      <div
        ref={ref}
        role="meter"
        aria-label={`${label} proficiency`}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuetext={note}
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-canvas-sunk"
      >
        <div
          className="gradient-wash h-full rounded-full transition-[width] duration-900 ease-out-soft"
          style={{ width: inView ? `${value}%` : '0%' }}
        />
      </div>
    </div>
  )
}
