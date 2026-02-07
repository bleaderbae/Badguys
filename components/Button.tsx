'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'outline-white' | 'outline-red'

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode
  variant?: ButtonVariant
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {

  const baseStyles = "px-8 py-4 font-bold text-lg rounded-none transition-colors"

  const variants = {
    primary: "bg-bgc-red hover:bg-bgc-red-dark text-white",
    "outline-white": "border-2 border-bgc-white hover:bg-white hover:text-bgc-black text-white",
    "outline-red": "border-2 border-bgc-red hover:bg-bgc-red text-bgc-red hover:text-white"
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}
