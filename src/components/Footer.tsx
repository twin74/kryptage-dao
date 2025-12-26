import Link from "next/link";

function SocialIcon({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <span
      aria-label={label}
      title={label}
      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-950/30 text-slate-200"
    >
      {children}
    </span>
  );
}

export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-10 pt-8">
      <div className="border-t border-slate-800 pt-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-slate-400">
            {new Date().getFullYear()} Kryptage DAO. All rights reserved.
          </div>

          <div className="flex items-center gap-3">
            {/* Email */}
            <Link
              href="mailto:info@kryptage.com"
              aria-label="Email"
              title="Email"
              className="inline-flex"
            >
              <SocialIcon label="Email">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4-8 5-8-5V6l8 5 8-5v2Z" />
                </svg>
              </SocialIcon>
            </Link>

            {/* X */}
            <Link
              href="https://x.com/kryptagefi"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
              title="X"
              className="inline-flex"
            >
              <SocialIcon label="X">
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-7-6.1 7H2.2l7.4-8.5L2 2h6.4l4.4 6.2L18.9 2Zm-1.1 18h1.7L7.5 3.9H5.7L17.8 20Z" />
                </svg>
              </SocialIcon>
            </Link>

            {/* Telegram */}
            <SocialIcon label="Telegram">
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21.8 4.6 19 19.2c-.2 1-.8 1.2-1.6.8l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.8.4l.3-4.9 8.9-8c.4-.4-.1-.6-.6-.2l-11 6.9-4.7-1.5c-1-.3-1-1 .2-1.5L20.1 3c.9-.3 1.8.2 1.7 1.6Z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}
