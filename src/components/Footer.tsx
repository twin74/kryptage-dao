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
            {/* Social links not available yet  keep icons non-clickable for now */}
            <SocialIcon label="Discord">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M20.3 4.3A16.4 16.4 0 0 0 16.2 3c-.2.4-.5 1-.6 1.4a15 15 0 0 0-7.1 0c-.2-.4-.4-1-.6-1.4a16.3 16.3 0 0 0-4.1 1.3C1.7 7.5 1 10.6 1.2 13.7c1.3 1 2.8 1.7 4.4 2.2.3-.4.7-1 1-1.5-.6-.2-1.2-.5-1.7-.9l.4-.3c3.3 1.6 7.1 1.6 10.4 0l.4.3c-.5.4-1 .7-1.7.9.3.5.6 1 1 1.5 1.6-.5 3.1-1.2 4.4-2.2.3-3.6-.4-6.7-2.7-9.4ZM8.7 13.1c-.8 0-1.5-.8-1.5-1.7 0-1 .7-1.7 1.5-1.7s1.5.8 1.5 1.7c0 1-.7 1.7-1.5 1.7Zm6.6 0c-.8 0-1.5-.8-1.5-1.7 0-1 .7-1.7 1.5-1.7s1.5.8 1.5 1.7c0 1-.7 1.7-1.5 1.7Z" />
              </svg>
            </SocialIcon>

            <SocialIcon label="X">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-7-6.1 7H2.2l7.4-8.5L2 2h6.4l4.4 6.2L18.9 2Zm-1.1 18h1.7L7.5 3.9H5.7L17.8 20Z" />
              </svg>
            </SocialIcon>

            <SocialIcon label="Telegram">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M21.8 4.6 19 19.2c-.2 1-.8 1.2-1.6.8l-4.5-3.3-2.2 2.1c-.2.2-.4.4-.8.4l.3-4.9 8.9-8c.4-.4-.1-.6-.6-.2l-11 6.9-4.7-1.5c-1-.3-1-1 .2-1.5L20.1 3c.9-.3 1.8.2 1.7 1.6Z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}
