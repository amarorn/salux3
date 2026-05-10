import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PresentationApp } from './PresentationApp';

const PremiumLanding = lazy(() => import('./landing/PremiumLanding'));

export function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Suspense fallback={<div className="min-h-screen bg-[#05070d]" aria-hidden />}>
            <PremiumLanding />
          </Suspense>
        }
      />
      <Route path="/apresentacao" element={<PresentationApp />} />
    </Routes>
  );
}
