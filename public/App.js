/**
 * Main App Component
 * Root component following React best practices
 */

const { useState } = React;

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

