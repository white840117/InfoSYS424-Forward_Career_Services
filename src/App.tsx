import { Route, Routes } from 'react-router-dom';
import { Shell } from './components/Shell';
import Cases, { AdvisingCaseView } from './modules/Cases';
import Contacts from './modules/Contacts';
import EmployerRecord from './modules/EmployerRecord';
import { EventRecord, EventsDirectory } from './modules/Events';
import Overview from './modules/Overview';
import Workflows from './modules/Workflows';
import Reports from './modules/Reports';
import Import from './modules/Import';
import Rules from './modules/Rules';
import Access from './modules/Access';
import Integrations from './modules/Integrations';

function NotFound() {
  return <p>Page not found.</p>;
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/employers" element={<Contacts />} />
        <Route path="/employers/:id" element={<EmployerRecord />} />
        <Route path="/events" element={<EventsDirectory />} />
        <Route path="/events/:id" element={<EventRecord />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/:id" element={<AdvisingCaseView />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/import" element={<Import />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/access" element={<Access />} />
        <Route path="/integrations" element={<Integrations />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
