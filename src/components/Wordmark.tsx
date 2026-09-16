import Link from "next/link";

export default function Wordmark() {
  return (
    <Link className="wordmark" href="/" aria-label="benjamonsh, inicio">
      benjamonsh <span className="wink">;)</span>
    </Link>
  );
}
