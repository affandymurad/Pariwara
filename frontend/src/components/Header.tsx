import React from 'react';
import { Sparkles, User } from 'lucide-react';

interface Props {
  onLogoClick?: () => void;
}

export default function Header({ onLogoClick }: Props) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-theme"
            style={{ background: 'color-mix(in srgb, var(--bg-surface) 90%, transparent)' }}>
      <div className="max-w-md md:max-w-3xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 lg:px-12 py-3">
        {/* Brand */}
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-2.5 text-left transition-opacity hover:opacity-80"
          aria-label="Kembali ke beranda Pariwara"
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm"
               style={{ background: 'var(--sage)' }}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold leading-none text-ink">Pariwara</h1>
            <p className="text-xs text-muted tracking-wide mt-0.5">
              Bantu Bikin Iklan Lebih Menarik
            </p>
          </div>
        </button>

        {/* Right side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <a
            href="https://affandymurad.github.io/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-sm font-semibold px-2.5 py-1.5 rounded-full border border-theme transition-all hover:opacity-75 whitespace-nowrap"
            style={{ background: 'var(--sage-light)', color: 'var(--sage)', borderColor: 'var(--sage-light)' }}
          >
            <User className="w-3 h-3 flex-shrink-0" />
            <span className="hidden sm:inline">Affandy Murad</span>
          </a>
        </div>
      </div>
    </header>
  );
}
