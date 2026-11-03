import { useEffect, useState } from 'react';
import axios from 'axios';
export default function UserList() {
  const [listOfUsers, setListOfUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function loadUsers() {
      setLoading(true); setError('');
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users', { signal: controller.signal, timeout: 15000 });
        if (!Array.isArray(response.data)) throw new Error('Unexpected response');
        if (!controller.signal.aborted) setListOfUsers(response.data);
      } catch (requestError) {
        if (!controller.signal.aborted && !axios.isCancel(requestError)) setError('We could not load the users. Check your connection and try again.');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    loadUsers();
    return () => controller.abort();
  }, [attempt]);
  const filteredUsers = listOfUsers.filter(user => user.name.toLowerCase().includes(search.trim().toLowerCase()));
  if (loading) return <div className="state-box" role="status"><span className="loader" aria-hidden="true"/><h2>Loading users...</h2><p>Getting the directory ready.</p></div>;
  if (error) return <div className="state-box"><h2>Something went wrong.</h2><p role="alert">{error}</p><button className="primary" onClick={() => setAttempt(previous => previous + 1)}>Try again</button></div>;
  return <section aria-label="User directory">
    <div className="toolbar"><div><label htmlFor="search">Search users by name</label><input id="search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Start typing a name…"/></div><p aria-live="polite">{filteredUsers.length} of {listOfUsers.length} users</p></div>
    {filteredUsers.length ? <div className="user-grid">{filteredUsers.map(user => {
      const expanded = expandedId === user.id;
      const initials = user.name.split(' ').map(word => word[0]).slice(0,2).join('');
      return <article className="user-card" key={user.id}><button className="user-summary" aria-expanded={expanded} aria-controls={`details-${user.id}`} onClick={() => setExpandedId(expanded ? null : user.id)}>
        <span className="card-top"><span className="avatar" aria-hidden="true">{initials}</span><span className="user-id">#{String(user.id).padStart(2,'0')}</span></span>
        <h2>{user.name}</h2><span className="email">{user.email}</span><span className="company">{user.company?.name || 'Company unavailable'}</span><span className="view-details">{expanded ? 'Hide details −' : 'View details +'}</span>
      </button>{expanded && <div className="details" id={`details-${user.id}`}><dl><dt>Address</dt><dd>{[user.address?.suite,user.address?.street,user.address?.city,user.address?.zipcode].filter(Boolean).join(', ') || 'Unavailable'}</dd><dt>Phone</dt><dd>{user.phone || 'Unavailable'}</dd><dt>Website</dt><dd>{user.website || 'Unavailable'}</dd></dl></div>}</article>;
    })}</div> : <div className="state-box" role="status"><h2>{listOfUsers.length ? 'No matching users.' : 'No users available.'}</h2><p>Try another name or clear your search.</p>{search && <button className="primary" onClick={() => setSearch('')}>Clear search</button>}</div>}
  </section>;
}
