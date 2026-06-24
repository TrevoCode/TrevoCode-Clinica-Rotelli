import Image from "next/image";

// Logo real da Clínica Rotelli (extraída do Instagram) num frame redondo.
export function Logo({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/rotelli-logo.jpg"
      alt="Clínica Rotelli"
      width={size}
      height={size}
      priority
      className={`rounded-full ring-1 ring-brand/15 shadow-sm object-cover ${className}`}
    />
  );
}

// Assinatura discreta "por Trevocode".
export function PorTrevocode({ className = "" }: { className?: string }) {
  return (
    <span className={`text-muted/70 text-xs ${className}`}>
      tecnologia <span className="font-semibold text-ink/60">Trevocode</span> 🍀
    </span>
  );
}
