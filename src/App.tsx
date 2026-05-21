import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Dashboard from './routes/Dashboard';
import NewInitiative from './routes/NewInitiative';
import EditInitiative from './routes/EditInitiative';
import InitiativeDetail from './routes/InitiativeDetail';
import ScoreInitiative from './routes/ScoreInitiative';
import Roadmap from './routes/Roadmap';
import PRDEdit from './routes/PRDEdit';
import PRDView from './routes/PRDView';

export default function App() {
  return (
    <Routes>
      {/* Standalone printable document — rendered outside the app chrome. */}
      <Route path="/initiatives/:id/prd/view" element={<PRDView />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/initiatives/new" element={<NewInitiative />} />
        <Route path="/initiatives/:id" element={<InitiativeDetail />} />
        <Route path="/initiatives/:id/edit" element={<EditInitiative />} />
        <Route path="/initiatives/:id/score" element={<ScoreInitiative />} />
        <Route path="/initiatives/:id/prd" element={<PRDEdit />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
