import { useCallback, useEffect, useRef, useState } from "react";
import { FiPause, FiPlay } from "react-icons/fi";

/**
 * Plays one client's recorded testimonial.
 *
 * Renders NOTHING without a `src`. A play button with no recording behind it
 * tells the reader a recording exists, which is a claim - and this is the one
 * section of the site whose entire job is being believed.
 *
 * The audio is never preloaded: three of these would otherwise fetch three
 * recordings the moment the section scrolls into view, for a control most
 * readers will not press.
 */

/* Every mounted note, so starting one can stop the rest. Two testimonials
   talking over each other is not a mix anyone can follow, and the reader has no
   way to tell which of them they are hearing. */
const playing = new Set();

function VoiceNote({ src, label }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) audio.pause();
  }, []);

  useEffect(() => {
    const entry = { stop };
    playing.add(entry);
    return () => {
      playing.delete(entry);
    };
  }, [stop]);

  if (!src) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      playing.forEach((other) => {
        if (other.stop !== stop) other.stop();
      });
      audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        /* The name is in the label, not just "play": a screen reader running
           the list hears three buttons, and "Play" three times says nothing
           about which voice is which. */
        aria-label={`${isPlaying ? "Pause" : "Play"} voice note from ${label}`}
        className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-line py-1.5 pl-1.5 pr-4 text-paper-dim transition-colors hover:border-line-strong hover:text-paper"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-raised text-paper">
          {isPlaying ? (
            <FiPause aria-hidden="true" size={12} />
          ) : (
            /* Nudged right: a triangle centred on its bounding box reads as
               sitting left of centre inside a circle. */
            <FiPlay aria-hidden="true" size={12} className="translate-x-px" />
          )}
        </span>
        <span className="font-mono text-xs">
          {isPlaying ? "Playing" : "Voice note"}
        </span>
      </button>

      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
    </>
  );
}

export default VoiceNote;
