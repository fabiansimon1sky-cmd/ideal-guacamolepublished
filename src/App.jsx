import { useMemo, useState } from 'react';
import './App.css';

// Change transportStatus on a shipment to any value from 0 to 4.
const TRANSPORT_STATES = [
  { label: 'Shipment booked', status: 'Booked', progress: 0 },
  { label: 'Picked up by carrier', status: 'Picked up', progress: 25 },
  { label: 'Combined shipment in transit', status: 'In transit', progress: 68 },
  { label: 'Arrived in Milan, Italy', status: 'Arrived', progress: 88 },
  { label: 'Customs clearance and final delivery', status: 'Delivered', progress: 100 },
];

const localTrackingDatabase = {
  'FL-2841': {
    bookedDate: 'September 21, 2025',
    origin: 'Austin, TX',
    destination: 'Milan, Italy',
    carrier: 'RoadRunner Express',
    shipment: {
      id: 'FL-2841',
      trackingNumber: 'FL-2841',
      vehicle: '2025 Tesla Cybertruck',
      vehicleCount: 5,
      vin: '5 vehicles in one shipment',
      origin: 'Austin, TX',
      destination: 'Milan, Italy',
      transportStatus: 4,
      eta: 'Today, 4:30 PM',
      color: 'Stainless steel',
      updated: '12 min ago',
    },
  },
};

const statusFilters = ['All shipments', 'Booked', 'Picked up', 'In transit', 'Arrived', 'Delivered'];

function App() {
  const [shipments, setShipments] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [filter, setFilter] = useState('All shipments');
  const [query, setQuery] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingInput, setTrackingInput] = useState('');
  const [trackingError, setTrackingError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState('');

  const selected = shipments.find((shipment) => shipment.id === selectedId) || shipments[0];
  const getTransportState = (shipment) => TRANSPORT_STATES[shipment?.transportStatus ?? 0];
  const selectedTransportState = getTransportState(selected);
  const visibleShipments = useMemo(() => shipments.filter((shipment) => {
    const matchesFilter = filter === 'All shipments' || getTransportState(shipment).status === filter;
    const searchable = `${shipment.vehicle} ${shipment.id} ${shipment.origin} ${shipment.destination}`.toLowerCase();
    return matchesFilter && searchable.includes(query.toLowerCase());
  }), [filter, query, shipments]);

  function showNotice(message) {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2600);
  }

  function addShipment(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newShipment = {
      id: `FL-${2842 + shipments.length}`,
      vehicle: data.get('vehicle'),
      vehicleCount: 1,
      vin: data.get('vin') || 'VIN pending',
      origin: data.get('origin'),
      destination: data.get('destination'),
      transportStatus: 1,
      eta: 'ETA pending',
      carrier: data.get('carrier'),
      color: 'Color pending',
      updated: 'Just now',
    };
    setShipments((current) => [newShipment, ...current]);
    setSelectedId(newShipment.id);
    setShowForm(false);
    showNotice('Shipment created and added to your queue.');
  }

  function startTracking(event) {
    event.preventDefault();
    const requestedNumber = trackingInput.trim().toUpperCase();
    const trackingRecord = localTrackingDatabase[requestedNumber];
    if (!trackingRecord) {
      setTrackingError('Tracking number not found.');
      setTrackingNumber('');
      return;
    }
    setTrackingError('');
    setShipments([trackingRecord.shipment]);
    setSelectedId(trackingRecord.shipment.id);
    setTrackingNumber(requestedNumber);
  }

  if (!trackingNumber) {
    return (
      <main className="tracking-entry">
        <div className="entry-brand"><span className="brand-mark">ML</span><span>mail-log shippment</span></div>
        <section className="entry-card">
          <div className="entry-icon">⌁</div>
          <p className="eyebrow">Vehicle tracking</p>
          <h1>Track your shipment</h1>
          <p className="entry-copy">Enter the tracking number from your shipment confirmation to see your vehicle's current location and delivery status.</p>
          <form onSubmit={startTracking}>
            <label className="tracking-label" htmlFor="tracking-number">Tracking number</label>
            <input id="tracking-number" className="tracking-input" value={trackingInput} onChange={(event) => setTrackingInput(event.target.value)} required autoFocus />
            <button className="primary-button entry-button">Track vehicle <span>→</span></button>
          </form>
          {trackingError && <p className="tracking-error" role="alert">{trackingError}</p>}
        </section>
        <p className="entry-footer">Secure shipment tracking <span>•</span> No account required</p>
      </main>
    );
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">ML</span><span>mail-log shippment</span></div>
        <div className="tracking-session"><span className="session-icon">⌁</span><span><strong>Tracking session</strong><small>{trackingNumber}</small></span></div>
        <nav className="main-nav" aria-label="Main navigation">
          <p className="nav-label">Shipment</p>
          <button className="nav-item active"><span className="nav-icon">▦</span>Overview</button>
          <button className="nav-item"><span className="nav-icon">↗</span>Shipment <span className="nav-count">{shipments.length}</span></button>
          <button className="nav-item"><span className="nav-icon">⌖</span>Route details</button>
        </nav>
        <div className="sidebar-bottom"><button className="change-tracking" onClick={() => setTrackingNumber('')}>Track another number <span>↗</span></button></div>
      </aside>

      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Tracking</span><b>/</b><strong>{trackingNumber}</strong></div><div className="top-actions"><button className="help-button">?</button><button className="primary-button" onClick={() => setTrackingNumber('')}>Track another <span>↗</span></button></div></header>
        <div className="content-wrap">
          <section className="welcome-row"><div><p className="eyebrow">Live shipment tracking</p><h1>Vehicles in transit <span>✦</span></h1><p className="subheading">Tracking number <strong>{trackingNumber}</strong> · Booked September 21, 2026.</p></div><button className="date-button">Updated just now <span>⌄</span></button></section>

          <section className="metric-grid" aria-label="Shipment summary"><article className="metric-card"><div className="metric-top"><span>Vehicles in shipment</span><span className="metric-icon metric-icon-blue">↗</span></div><strong>{shipments.reduce((total, shipment) => total + (shipment.vehicleCount || 1), 0)}</strong><p><span>Booked Sep 21, 2025</span></p></article><article className="metric-card"><div className="metric-top"><span>Shipment status</span><span className="metric-icon metric-icon-teal">⌁</span></div><strong>{shipments.filter((shipment) => getTransportState(shipment).status === 'In transit').length}</strong><p><span className="trend up">Live</span> <span>combined load</span></p></article><article className="metric-card"><div className="metric-top"><span>Delivered</span><span className="metric-icon metric-icon-green">✓</span></div><strong>{shipments.filter((shipment) => getTransportState(shipment).status === 'Delivered').length}</strong><p><span>Completed shipments</span></p></article><article className="metric-card"><div className="metric-top"><span>Exceptions</span><span className="metric-icon metric-icon-red">!</span></div><strong>0</strong><p><span>Needs attention</span></p></article></section>

          <section className="dashboard-grid"><div className="panel shipments-panel"><div className="panel-heading"><div><h2>Combined shipment</h2><p>Five vehicles moving together under this tracking number</p></div><button className="text-button" onClick={() => setFilter('All shipments')}>View all <span>→</span></button></div><div className="toolbar"><label className="search-box"><span>⌕</span><input aria-label="Search shipments" value={query} onChange={(event) => setQuery(event.target.value)} /></label><button className="filter-button">≡ <span>Filter</span></button></div><div className="filter-tabs">{statusFilters.map((status) => <button key={status} className={filter === status ? 'filter-tab selected' : 'filter-tab'} onClick={() => setFilter(status)}>{status}{status === 'All shipments' && <span className="tab-count">{shipments.length}</span>}</button>)}</div><div className="shipment-list">{visibleShipments.map((shipment) => { const transportState = getTransportState(shipment); return <button key={shipment.id} className={selected.id === shipment.id ? 'shipment-row selected-row' : 'shipment-row'} onClick={() => setSelectedId(shipment.id)}><div className="vehicle-thumb"><span className={`vehicle-shape ${transportState.status === 'Delivered' ? 'vehicle-green' : ''}`}>▰</span></div><div className="shipment-main"><div className="shipment-title"><strong>{shipment.vehicleCount || 1} × {shipment.vehicle}</strong><span className={`status-pill ${transportState.status.toLowerCase().replace(' ', '-')}`}>{transportState.status}</span></div><small>{shipment.id} <span>•</span> {shipment.origin} <b>→</b> {shipment.destination}</small><div className="progress-line"><span style={{ width: `${transportState.progress}%` }} /></div></div><div className="shipment-eta"><small>Expected delivery</small><strong>{shipment.eta}</strong></div><span className="row-arrow">›</span></button>; })}{visibleShipments.length === 0 && <div className="empty-state">No shipments match your search.</div>}</div></div>

            <aside className="panel detail-panel"><div className="detail-heading"><div><p className="eyebrow">Combined shipment</p><h2>{selected.vehicleCount} × {selected.vehicle}</h2></div><button className="more-button">•••</button></div><div className="detail-vehicle"><div className="large-vehicle">▰</div><div><h3>{trackingNumber}</h3><p>{selected.color} <span>•</span> {selected.vin}</p></div></div><div className="current-status"><div><span className="status-live-dot" /><div><small>Current transportation status</small><strong>{selectedTransportState.status}</strong></div></div><span className="status-updated">State {selected.transportStatus} · Updated 12 min ago</span></div><div className="route-map"><div className="map-grid" /><div className="route-line"><span className="route-dot origin-dot" /><span className="route-segment segment-one" /><span className="route-segment segment-two" /><span className="route-dot destination-dot" /></div><div className="map-label origin-label"><b>{selected.origin.split(',')[0]}</b><small>Origin</small></div><div className="map-label destination-label"><b>{selected.destination.split(',')[0]}</b><small>Destination</small></div><span className="truck-marker">▰</span></div><div className="route-meta"><div><small>Current location</small><strong>{selectedTransportState.status === 'Delivered' ? selected.destination : selected.origin}</strong></div><div><small>Expected arrival</small><strong>{selected.eta}</strong></div></div><div className="detail-divider" /><div className="timeline-heading"><span>Transportation timeline</span><small>State {selected.transportStatus} of 4</small></div><div className="timeline">{TRANSPORT_STATES.map((transportState, index) => <div key={transportState.label} className={index < selected.transportStatus ? 'timeline-item done' : index === selected.transportStatus ? 'timeline-item current' : 'timeline-item upcoming'}><span>{index < selected.transportStatus ? '✓' : index === selected.transportStatus ? '•' : '○'}</span><div><strong>{transportState.label}</strong><small>{index < selected.transportStatus ? 'Completed' : index === selected.transportStatus ? 'Current status · Updated 12 min ago' : 'Expected next stage'}</small></div></div>)}</div></aside>
          </section>
          <footer className="page-footer"><span><i className="live-dot" /> All systems operational</span><span>Last synced just now</span></footer>
        </div>
      </main>
      {showForm && <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setShowForm(false)}><form className="modal" onSubmit={addShipment}><div className="modal-heading"><div><p className="eyebrow">Add vehicle</p><h2>New shipment</h2></div><button type="button" className="close-button" onClick={() => setShowForm(false)}>×</button></div><label>Vehicle name<input name="vehicle" placeholder="e.g. 2024 Audi Q5" required /></label><label>VIN <span>(optional)</span><input name="vin" placeholder="17-character VIN" /></label><div className="form-grid"><label>Origin<input name="origin" placeholder="City, state" required /></label><label>Destination<input name="destination" placeholder="City, state" required /></label></div><label>Carrier<select name="carrier" defaultValue="RoadRunner Express"><option>RoadRunner Express</option><option>Horizon Auto</option><option>Northstar Logistics</option></select></label><button className="primary-button submit-button">Add vehicle <span>→</span></button></form></div>}
      {notice && <div className="toast">✓ {notice}</div>}
    </div>
  );
}

export default App;
