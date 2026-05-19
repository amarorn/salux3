import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { PresentationApp } from './PresentationApp';
import { ContactFormPage } from './pages/ContactFormPage';

const PremiumLanding = lazy(() => import('./landing/PremiumLanding'));

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PresentationApp />} />
      <Route path="/apresentacao" element={<PresentationApp />} />
      <Route path="/formulario" element={<ContactFormPage />} />
      <Route
        path="/landing"
        element={
          <Suspense fallback={null}>
            <PremiumLanding />
          </Suspense>
        }
      />
    </Routes>
  );
}
