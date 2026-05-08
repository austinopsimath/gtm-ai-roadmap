import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './routes/Dashboard';
import NewInitiative from './routes/NewInitiative';
import EditInitiative from './routes/EditInitiative';
import InitiativeDetail from './routes/InitiativeDetail';
import ScoreInitiative from './routes/ScoreInitiative';
import Roadmap from './routes/Roadmap';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/initiatives/new" element={<NewInitiative />} />
        <Route path="/initiatives/:id" element={<InitiativeDetail />} />
        <Route path="/initiatives/:id/edit" element={<EditInitiative />} />
        <Route path="/initiatives/:id/score" element={<ScoreInitiative />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
