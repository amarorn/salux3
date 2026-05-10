import { Route, Routes } from 'react-router-dom';
import { PresentationApp } from './PresentationApp';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<PresentationApp />} />
      <Route path="/apresentacao" element={<PresentationApp />} />
    </Routes>
  );
}
