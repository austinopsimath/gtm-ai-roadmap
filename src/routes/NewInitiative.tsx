import { useNavigate } from 'react-router-dom';
import InitiativeForm from '../components/InitiativeForm';
import { useRoadmapStore } from '../store';
import { createInitiative } from '../types';

export default function NewInitiative() {
  const navigate = useNavigate();
  const addInitiative = useRoadmapStore((s) => s.addInitiative);

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          New initiative
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          Add an initiative to your registry. You can fill in only what you know
          today and come back to complete the rest later.
        </p>
      </header>
      <InitiativeForm
        submitLabel="Create initiative"
        onSubmit={(values) => {
          const initiative = createInitiative(values);
          addInitiative(initiative);
          navigate(`/initiatives/${initiative.id}`);
        }}
        onCancel={() => navigate('/')}
      />
    </div>
  );
}
