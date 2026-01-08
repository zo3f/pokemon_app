/**
 * RomList Component
 * Displays a list of available ROM files with click-to-play functionality
 */

const { useState, useEffect } = React;

function RomList({ onRomSelect, selectedRomUrl }) {
  const [roms, setRoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchRoms = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/roms');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (isMounted) {
          setRoms(Array.isArray(data.roms) ? data.roms : []);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load ROMs:', err);
          setError(err.message);
          setRoms([]);
          setLoading(false);
        }
      }
    };

    fetchRoms();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRomClick = (romName) => {
    const url = `/roms/${encodeURIComponent(romName)}`;
    onRomSelect(url, romName);
    
    // Log play event
    if (window.logRomPlay) {
      window.logRomPlay(romName);
    }
  };

  if (loading) {
    return (
      <div className="rom-list">
        <p className="rom-loading">Loading ROMs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rom-list">
        <p className="rom-error">
          Error loading ROMs: {error}
        </p>
      </div>
    );
  }

  if (roms.length === 0) {
    return (
      <div className="rom-list">
        <p className="rom-empty">
          No ROMs found. Add <code>.gba</code> files to the{' '}
          <code>data/roms/</code> folder on the server to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className="rom-list">
      {roms.map((name) => (
        <button
          key={name}
          type="button"
          className={
            'rom-chip' +
            (selectedRomUrl === `/roms/${encodeURIComponent(name)}`
              ? ' rom-chip--active'
              : '')
          }
          onClick={() => handleRomClick(name)}
          aria-label={`Play ${name}`}
        >
          {name}
        </button>
      ))}
    </div>
  );
}

