import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/app/layout/AppShell'
import { ComparePage } from '@/features/city-comparison/ComparePage'
import { EarthPage } from '@/features/earth/EarthPage'
import { GoldenHourPage } from '@/features/golden-hour/GoldenHourPage'
import { SunExplorerPage } from '@/features/sun-explorer/SunExplorerPage'
import { WeatherPage } from '@/features/weather/WeatherPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<SunExplorerPage />} />
          <Route path="studio" element={<GoldenHourPage />} />
          <Route path="weather" element={<WeatherPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="earth" element={<EarthPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
