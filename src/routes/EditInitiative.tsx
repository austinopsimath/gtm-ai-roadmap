import { Navigate, useNavigate, useParams } from 'react-router-dom';
import InitiativeForm from '../components/InitiativeForm';
import { useRoadmapStore } from '../store';

export default function EditInitiative() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const initiative = useRoadmapStore((s) =>
    s.initiatives.find((i) => i.id === id),
  );
  const updateInitiative = useRoadmapStore((s) => s.updateInitiative);

  if (!initiative) return <Navigate to="/" replace />;

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
          Edit initiative
        </h1>
        <p className="mt-1 text-sm text-gray-600">{initiative.name}</p>
      </header>
      <InitiativeForm
        initial={initiative}
        submitLabel="Save changes"
        onSubmit={(values) => {
          updateInitiative(initiative.id, values);
          navigate(`/initiatives/${initiative.id}`);
        }}
        onCancel={() => navigate(`/initiatives/${initiative.id}`)}
      />
    </div>
  );
}
