import { QueryProvider } from '@/app/providers/QueryProvider'
import { AppRouter } from '@/app/routes/AppRouter'

export default function App() {
  return (
    <QueryProvider>
      <AppRouter />
    </QueryProvider>
  )
}
