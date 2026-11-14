import type { ReactNode } from 'react';
import { Link, Navigate, Route, Routes } from 'react-router-dom';
import type { ModuleId } from './access';
import { HomeRedirect, ModuleGate, SettingsGate, Shell } from './components/Shell';
import Import from './modules/Import';
import Contacts from './modules/Contacts';
import Duplicates from './modules/Duplicates';
import EmployerRecord from './modules/EmployerRecord';
import { EventRecord, EventsDirectory } from './modules/Events';
import Reports from './modules/Reports';
import Settings from './modules/Settings';
import StudentNotes, { AdvisingCaseView } from './modules/StudentNotes';
import Workflows from './modules/Workflows';

function NotFound() {
  return <p>Page not found.</p>;
}

/** Import preview opened outside Settings by the ER Manager. */
function ManagerImport() {
  return (
    <>
      <Link className="back" to="/duplicates">← Duplicate review</Link>
      <Import />
    </>
  );
}

const gate = (m: ModuleId, el: ReactNode) => <ModuleGate module={m}>{el}</ModuleGate>;

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/employers" element={gate('employers', <Contacts />)} />
        <Route path="/employers/:id" element={gate('employers', <EmployerRecord />)} />
        <Route path="/events" element={gate('events', <EventsDirectory />)} />
        <Route path="/events/:id" element={gate('events', <EventRecord />)} />
        <Route path="/notes" element={gate('notes', <StudentNotes />)} />
        <Route path="/notes/:id" element={gate('notes', <AdvisingCaseView />)} />
        <Route path="/duplicates" element={gate('duplicates', <Duplicates />)} />
        <Route path="/workflows" element={gate('workflows', <Workflows />)} />
        <Route path="/reports" element={gate('reports', <Reports />)} />
        <Route path="/import" element={<Navigate to="/settings/import" replace />} />
        <Route
          path="/settings/*"
          element={<SettingsGate settings={<Settings />} importOnly={<ManagerImport />} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
