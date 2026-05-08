import { Routes, Route } from 'react-router-dom';
import Dashboard from './routes/Dashboard';

export default function App() {
  return (
    <div className="min-h-full bg-gray-50 text-gray-900">
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
