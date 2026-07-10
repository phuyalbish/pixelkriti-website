import { motion, useReducedMotion } from "framer-motion";

/**
 * Fades content up as it enters the viewport. `delay` staggers siblings.
 * Honours the OS reduced-motion setting by rendering the end state directly.
 */
function Reveal({ as = "div", delay = 0, className = "", children }) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as] ?? motion.div;

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      // The blur is what makes it read as focus arriving, not just movement.
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}

export default Reveal;
