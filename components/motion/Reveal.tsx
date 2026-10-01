"use client";

import { motion, useReducedMotion } from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/** Fades and lifts content into view once as it scrolls on screen. */
export function Reveal({
  children,
  delay = 0,
  y = 14,
  className,
  as = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, transform: `translateY(${reduce ? 0 : y}px)` }}
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: reduce ? 0.15 : 0.45, delay: reduce ? 0 : delay, ease }}
    >
      {children}
    </Tag>
  );
}

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = {
  hidden: { opacity: 0, transform: "translateY(14px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.4, ease } },
};
const itemReduced = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.15 } } };

/** Children (wrap each in <StaggerItem>) cascade in 60 ms apart when the group scrolls into view. */
export function Stagger({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? itemReduced : item}>
      {children}
    </motion.div>
  );
}
