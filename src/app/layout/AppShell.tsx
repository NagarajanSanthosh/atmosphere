import { Outlet } from 'react-router-dom'
import { AppHeader } from '@/app/layout/AppHeader'

export function AppShell() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-hidden pb-[env(safe-area-inset-bottom)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[32vh] bg-[radial-gradient(ellipse_at_top,rgba(255,196,90,0.09),transparent_65%)] sm:h-[42vh]"
      />
      <AppHeader />
      <main className="relative mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
        <Outlet />
      </main>
      <footer className="relative border-t border-white/[0.05] px-4 py-4 text-center text-[0.7rem] leading-relaxed tracking-wide text-mist-500 sm:px-6 sm:py-5 sm:text-xs lg:px-8">
        <span className="text-sun-500/80">◆</span>
        <span className="mx-1.5 sm:mx-2">
          Frontend-only · No accounts · Solar math in your browser
        </span>
        <span className="text-sun-500/80">◆</span>
      </footer>
    </div>
  )
}
