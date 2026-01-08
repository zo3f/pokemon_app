/**
 * React Application Bundle
 * All components and hooks inlined for Babel standalone compilation
 */

const { useState, useEffect, useRef } = React;

// ErrorBoundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>
            The application encountered an error. Please refresh the page.
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="primary-button"
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// useSmoothScroll Hook
function useSmoothScroll() {
  useEffect(() => {
    const handleClick = (event) => {
      const link = event.target.closest('.nav-link[href^="#"]');
      if (!link) return;

      const targetId = link.getAttribute('href');
      if (!targetId || !targetId.startsWith('#')) return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
}

// RomList Component
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
    // Sanitize ROM name to prevent XSS
    const sanitizedName = String(romName)
      .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
      .trim();
    
    if (!sanitizedName || sanitizedName.length === 0) {
      console.error('Invalid ROM name');
      return;
    }
    
    const url = `/roms/${encodeURIComponent(sanitizedName)}`;
    onRomSelect(url, sanitizedName);
    
    if (window.logRomPlay) {
      window.logRomPlay(sanitizedName);
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
      {roms.map((name) => {
        // React automatically escapes content, but ensure we're using text content
        const displayName = String(name || '').trim();
        if (!displayName) return null;
        
        return (
          <button
            key={displayName}
            type="button"
            className={
              'rom-chip' +
              (selectedRomUrl === `/roms/${encodeURIComponent(displayName)}`
                ? ' rom-chip--active'
                : '')
            }
            onClick={() => handleRomClick(displayName)}
            aria-label={`Play ${displayName}`}
          >
            {displayName}
          </button>
        );
      })}
    </div>
  );
}

// EmulatorFrame Component
function EmulatorFrame({ romUrl, romName }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (iframeRef.current && romUrl) {
      // Sanitize URL to prevent XSS
      const sanitizedUrl = String(romUrl)
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
      
      if (sanitizedUrl && sanitizedUrl.startsWith('/roms/')) {
        iframeRef.current.src = `/emulator.html?rom=${encodeURIComponent(sanitizedUrl)}`;
      }
    }
  }, [romUrl]);

  if (!romUrl) {
    return (
      <div className="emulator-frame">
        <p className="emulator-placeholder">
          Choose a ROM from the list above to start playing.
        </p>
      </div>
    );
  }

  // Sanitize display name for XSS prevention (React escapes by default, but be explicit)
  const displayName = String(romName || '').trim();
  const sanitizedUrl = String(romUrl || '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();

  return (
    <div className="emulator-frame">
      {displayName && (
        <div className="now-playing">
          Now playing: <span>{displayName}</span>
        </div>
      )}
      {sanitizedUrl && sanitizedUrl.startsWith('/roms/') && (
        <iframe
          ref={iframeRef}
          title="GBA Emulator"
          className="emulator-iframe"
          src={`/emulator.html?rom=${encodeURIComponent(sanitizedUrl)}`}
          frameBorder="0"
          allowFullScreen
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      )}
    </div>
  );
}

// Header Component
function Header() {
  useSmoothScroll();

  return (
    <header className="app-header">
      <div className="logo-title">
        <img
          src="bulbasaur_image.png"
          alt="Bulbasaur"
          className="logo-icon"
        />
        <div>
          <h1 className="app-title">Bulbasaur&apos;s World</h1>
          <p className="app-subtitle">
            Play classic GBA games in a cozy Pokémon-inspired hub.
          </p>
        </div>
      </div>
      <nav className="main-nav">
        <ul className="nav-links">
          <li>
            <a href="#about" className="nav-link">
              About
            </a>
          </li>
          <li>
            <a href="#games" className="nav-link">
              Play GBA
            </a>
          </li>
          <li>
            <a href="#rom-info" className="nav-link">
              ROM Info
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

// AboutSection Component
function AboutSection() {
  return (
    <section id="about" className="card card-about">
      <h2>About Bulbasaur</h2>
      <p>
        Bulbasaur is a dual-type Grass/Poison Pokémon known for its adorable
        appearance and unique features.
      </p>
      <p>
        Behind the cute face is a tough little dinosaur vibe. That mix of charm
        and strength is exactly why Bulbasaur is my favorite starter.
      </p>
      <p className="highlight-text">
        This app is a small playground to learn JavaScript, Node, React, and
        modern front-end techniques using Bulbasaur as the mascot.
      </p>
    </section>
  );
}

// GamesSection Component
function GamesSection({ selectedRomUrl, selectedRomName, onRomSelect }) {
  return (
    <section id="games" className="card card-emulator">
      <h2>Play Game Boy Advance Games</h2>
      <p className="section-description">
        Drop your <strong>.gba</strong> files into the server&apos;s{' '}
        <code>data/roms/</code> folder and click a game below to start playing
        in the browser.
      </p>

      <RomList
        onRomSelect={onRomSelect}
        selectedRomUrl={selectedRomUrl}
      />

      <EmulatorFrame romUrl={selectedRomUrl} romName={selectedRomName} />
    </section>
  );
}

// RomInfoSection Component
function RomInfoSection() {
  return (
    <section id="rom-info" className="card card-rom-info">
      <h2>ROM Usage & Tips</h2>
      <ul className="info-list">
        <li>Use your own legally obtained backups of games you own.</li>
        <li>
          ROMs never leave your device; they are loaded directly from your
          browser.
        </li>
        <li>
          ROM play events are logged in a small SQLite database on the server
          for learning/demo purposes.
        </li>
      </ul>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="app-footer">
      <p>
        © 2025 Bulbasaur Fan Site · Built with Node.js, React, SQLite, and
        EmulatorJS
      </p>
    </footer>
  );
}

// Main App Component
function App() {
  const [selectedRomUrl, setSelectedRomUrl] = useState('');
  const [selectedRomName, setSelectedRomName] = useState('');

  const handleRomSelect = (url, name) => {
    setSelectedRomUrl(url);
    setSelectedRomName(name);
  };

  return (
    <ErrorBoundary>
      <div className="app-root">
        <Header />
        <main className="main-layout">
          <AboutSection />
          <GamesSection
            selectedRomUrl={selectedRomUrl}
            selectedRomName={selectedRomName}
            onRomSelect={handleRomSelect}
          />
        </main>
        <RomInfoSection />
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

