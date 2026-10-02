import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Check, Copy, Mail, X } from 'lucide-react';
import { profile } from '../data/content';

const OpenContext = createContext<() => void>(() => {});
export const useOpenContact = () => useContext(OpenContext);

const subject = encodeURIComponent('Portfolio enquiry');
const to = encodeURIComponent(profile.email);
const options = [
  { label: 'Open my email app', href: `mailto:${profile.email}?subject=${subject}`, newTab: false },
  { label: 'Write in Gmail', href: `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}`, newTab: true },
  { label: 'Write in Yahoo Mail', href: `https://compose.mail.yahoo.com/?to=${to}&subject=${subject}`, newTab: true },
];

const optionClass =
  'flex items-center justify-between gap-3 rounded-full border-2 border-[#D7E2EA] px-6 py-3 text-sm font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10 sm:text-base';

export function ContactProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    opener.current = document.activeElement as HTMLElement | null;
    setCopied(false);
    setOpen(true);
  }, []);
  const hide = useCallback(() => {
    setOpen(false);
    opener.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && hide();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, hide]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
    } catch {
      inputRef.current?.select();
    }
  };

  return (
    <OpenContext.Provider value={show}>
      {children}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => e.target === e.currentTarget && hide()}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="contact-title" className="relative flex w-full max-w-md flex-col gap-5 rounded-[32px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-6 sm:p-8">
            <button ref={closeRef} onClick={hide} aria-label="Close" className="absolute right-4 top-4 rounded-full p-2 text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10">
              <X size={22} />
            </button>
            <h2 id="contact-title" className="hero-heading pr-10 text-4xl font-black uppercase leading-none sm:text-5xl">Email Keith</h2>
            <p className="font-light leading-relaxed text-[#D7E2EA]/80">Pick how you would like to write. Your message goes to the address below.</p>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                id="contact-email"
                readOnly
                value={profile.email}
                aria-label="Email address"
                onFocus={(e) => e.currentTarget.select()}
                className="min-w-0 flex-1 rounded-full border border-[#D7E2EA]/40 bg-transparent px-5 py-3 text-[#D7E2EA]"
              />
              <button onClick={copy} className="flex shrink-0 items-center gap-2 rounded-full border border-[#D7E2EA]/40 px-4 py-3 text-sm text-[#D7E2EA] transition-colors hover:bg-[#D7E2EA]/10">
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {options.map((o) => (
                <a key={o.label} href={o.href} className={optionClass} {...(o.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                  {o.label}
                  <Mail size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </OpenContext.Provider>
  );
}
