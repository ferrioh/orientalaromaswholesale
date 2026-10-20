import { motion, useReducedMotion, useTransform, type MotionValue } from 'motion/react';

export default function SceneTransition({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const opacity = useTransform(progress, value => reduce ? 0 : Math.sin(value * Math.PI) * .17);
  return <motion.div className="scene-soft-light" style={{ opacity }} aria-hidden="true" />;
}
