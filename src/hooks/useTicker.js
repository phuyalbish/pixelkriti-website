import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A counter that advances every `ms`, driving the looping card visuals
 * (terminal feeds, cycling chat bubbles). Holds still under reduced motion,
 * so those visuals render their resting frame.
 */
export default function useTicker(ms) {
  const reduceMotion = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = setInterval(() => setTick((value) => value + 1), ms);
    return () => clearInterval(id);
  }, [ms, reduceMotion]);

  return tick;
}
