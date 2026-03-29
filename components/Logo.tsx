import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="font-mono text-2xl font-bold leading-[1.32] text-foreground">
        martintarot.com
      </span>
    </Link>
  );
}
