"use client";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
	/** Content you want to animate */
	children: ReactNode;

	/** Delay before animation starts (in seconds) */
	delay?: number;

	/** Optional className for styling */
	className?: string;

	onetime?: boolean;
}

/**
 * A reusable fade-in wrapper that animates its children
 * when they enter the viewport.
 */
function FadeInTextAnimation({ children, delay = 0, onetime = true, className }: FadeInProps) {
	return (
		<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut", delay }} viewport={{ once: onetime }} className={className}>
			{children}
		</motion.div>
	);
}

export default FadeInTextAnimation;
