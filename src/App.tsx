import { Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell';
import Overview from './modules/Overview';

function NotFound() {
  return <p>Page not found.</p>;
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
