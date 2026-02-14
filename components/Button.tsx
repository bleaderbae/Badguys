'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import Link from 'next/link'
import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline-white' | 'outline-red'

interface ButtonProps extends Omit<HTMLMotionProps<"button">, 'ref'> {
  children: ReactNode
  variant?: ButtonVariant
  className?: string
  href?: string
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  href,
  ...props
}: ButtonProps) {

  const baseStyles = "px-8 py-4 font-bold text-lg rounded-none transition-colors inline-block text-center cursor-pointer focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bgc-white focus:outline-none"

  const variants = {
    primary: "bg-bgc-red hover:bg-bgc-red-dark text-white",
    "outline-white": "border-2 border-bgc-white hover:bg-white hover:text-bgc-black text-white",
    "outline-red": "border-2 border-bgc-red hover:bg-bgc-red text-bgc-red hover:text-white"
  }

  const combinedClassName = `${baseStyles} ${variants[variant]} ${className}`.trim()

  if (href) {
    return (
      <Link href={href} className="contents">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={combinedClassName}
          {...(props as any)}
        >
          {children}
        </motion.div>
      </Link>
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={combinedClassName}
      {...props}
    >
      {children}
    </motion.button>
  )
}
