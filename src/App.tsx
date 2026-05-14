import { Route, Routes } from 'react-router-dom';
import { PresentationApp } from './PresentationApp';
import { ContactFormPage } from './pages/ContactFormPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PresentationApp />} />
      <Route path="/apresentacao" element={<PresentationApp />} />
      <Route path="/formulario" element={<ContactFormPage />} />
    </Routes>
  );
}
