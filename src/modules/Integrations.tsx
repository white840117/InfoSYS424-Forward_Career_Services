import { Feature, PageHead, Pill } from '../components/ui';
import integrations from '../data/integrations.json';

export default function Integrations() {
  return (
    <>
      <PageHead eyebrow="Settings" title="Integrations"
        sub="Client Update 2 says the CRM needs integration with university systems. None of these connections exists yet." />
      <Feature id="R11" title="Integrations panel" category="Integration"
        description="Each connection is shown with what it would send to the CRM and the question still open.">
        <div className="cards" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {integrations.map((i) => (
            <article key={i.name} className="item" style={{ borderStyle: 'dashed', borderColor: '#9AA4B1' }}>
              <div className="item-head">
                <strong style={{ fontSize: 15, color: 'var(--heading)' }}>{i.name}</strong>
                <Pill value={i.status} />
              </div>
              <div className="small"><span className="muted">Sends to the CRM:</span> {i.data}</div>
              <div className="small"><span className="muted">Used by:</span> {i.usedBy}</div>
              <div className="small"><span className="muted">Open question:</span> {i.question}</div>
            </article>
          ))}
        </div>
      </Feature>
    </>
  );
}
