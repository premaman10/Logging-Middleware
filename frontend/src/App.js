import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all URLs on mount
  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/urls');
      const data = await res.json();
      if (data.status) {
        setUrls(data.data);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch URLs');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl: longUrl }),
      });
      const data = await res.json();
      if (data.status) {
        setShortUrl(data.data.shortUrl);
        fetchUrls();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>URL Shortener</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
          <input
            type="text"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            placeholder="Enter long URL"
            style={{ width: 300, padding: 8 }}
          />
          <button type="submit" style={{ marginLeft: 10, padding: 8 }} disabled={loading}>
            {loading ? 'Shortening...' : 'Shorten'}
          </button>
        </form>
        {shortUrl && (
          <div style={{ marginBottom: 20 }}>
            <strong>Short URL: </strong>
            <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
          </div>
        )}
        {error && <div style={{ color: 'red', marginBottom: 20 }}>{error}</div>}
        <h2>All Shortened URLs</h2>
        <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Long URL</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Short URL</th>
              <th style={{ border: '1px solid #ccc', padding: 8 }}>Code</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url._id}>
                <td style={{ border: '1px solid #ccc', padding: 8, maxWidth: 200, wordBreak: 'break-all' }}>{url.originalUrl}</td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>
                  <a href={`http://localhost:5000/${url.shortId}`} target="_blank" rel="noopener noreferrer">
                    {`http://localhost:5000/${url.shortId}`}
                  </a>
                </td>
                <td style={{ border: '1px solid #ccc', padding: 8 }}>{url.shortId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
    </div>
  );
}

export default App;
