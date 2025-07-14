import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);

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
        <div className="card-container">
          <h1 style={{ marginBottom: 24 }}>URL Shortener</h1>
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <input
              type="text"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              placeholder="Enter long URL"
              className="form-input"
            />
            <button
              type="submit"
              className="form-button"
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Shortening...' : 'Shorten'}
            </button>
          </form>
          {shortUrl && (
            <div className="short-url-box">
              <strong>Short URL: </strong>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a>
            </div>
          )}
          {error && <div className="error-message">{error}</div>}
        </div>
        <h2 style={{ marginBottom: 16 }}>All Shortened URLs</h2>
        <table className="urls-table">
          <thead>
            <tr>
              <th>Long URL</th>
              <th>Short URL</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>
            {urls.map((url) => (
              <tr key={url._id}>
                <td style={{ maxWidth: 200, wordBreak: 'break-all' }}>{url.originalUrl}</td>
                <td>
                  <a href={`http://localhost:5000/${url.shortId}`} target="_blank" rel="noopener noreferrer">
                    {`http://localhost:5000/${url.shortId}`}
                  </a>
                </td>
                <td>{url.shortId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </header>
      <footer style={{
        width: '100%',
        background: '#20232a',
        color: '#61dafb',
        textAlign: 'center',
        padding: '18px 0 12px 0',
        position: 'fixed',
        left: 0,
        bottom: 0,
        zIndex: 100,
        fontSize: '1.1rem',
        letterSpacing: '0.5px',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.12)'
      }}>
        Made with ❤️ by Prem Aman &nbsp;|&nbsp;
        <a href="https://github.com/premaman10" target="_blank" rel="noopener noreferrer" style={{ color: '#61dafb', textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <svg height="20" width="20" viewBox="0 0 16 16" fill="#61dafb" xmlns="http://www.w3.org/2000/svg" style={{ verticalAlign: 'middle' }}>
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.11 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.91.08 2.11.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          @premaman10
        </a>
      </footer>
    </div>
  );
}

export default App;
