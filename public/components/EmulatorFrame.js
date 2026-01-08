/**
 * EmulatorFrame Component
 * Displays the EmulatorJS iframe for playing GBA games
 */

const { useEffect, useRef } = React;

function EmulatorFrame({ romUrl, romName }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    // Reset iframe when ROM changes
    if (iframeRef.current && romUrl) {
      // Force reload iframe by changing src
      iframeRef.current.src = `/emulator.html?rom=${encodeURIComponent(romUrl)}`;
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

  return (
    <div className="emulator-frame">
      <div className="now-playing">
        Now playing: <span>{romName}</span>
      </div>
      <iframe
        ref={iframeRef}
        title="GBA Emulator"
        className="emulator-iframe"
        src={`/emulator.html?rom=${encodeURIComponent(romUrl)}`}
        frameBorder="0"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

