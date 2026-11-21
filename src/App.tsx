import { HelmetProvider } from 'react-helmet-async'
import { QueryProvider } from '@/app/providers/QueryProvider'
import { AppRouter } from '@/app/routes/AppRouter'
import { IntroSplash } from '@/components/intro/IntroSplash'

export default function App() {
  return (
    <HelmetProvider>
      <QueryProvider>
        {/* Intro first in tree so it can cover the shell on the same paint */}
        <IntroSplash />
        <AppRouter />
      </QueryProvider>
    </HelmetProvider>
  )
}
