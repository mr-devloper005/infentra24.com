'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type RevealVariant = 'up' | 'fade' | 'left' | 'right' | 'zoom'

type RevealProps = {
  children: ReactNode
  as?: ElementType
  variant?: RevealVariant
  /** Delay in milliseconds before the element animates in. */
  delay?: number
  /** Re-run the animation every time it scrolls into view. */
  once?: boolean
  className?: string
  style?: React.CSSProperties
}

/**
 * Lightweight scroll-reveal primitive (IntersectionObserver + CSS).
 * Provides the premium fade/slide/zoom entrances used across the site without any
 * external animation dependency. Honors prefers-reduced-motion via editable-global.css.
 */
export function Reveal({
  children,
  as,
  variant = 'up',
  delay = 0,
  once = true,
  className = '',
  style,
}: RevealProps) {
  const Tag = (as || 'div') as ElementType
  const ref = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  return (
    <Tag
      ref={ref}
      data-variant={variant}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  )
}

/**
 * Convenience wrapper: maps children through Reveal with an incremental stagger delay.
 * Use for grids/lists where each item should cascade in.
 */
export function Stagger({
  children,
  step = 80,
  base = 0,
  variant = 'up',
  className = '',
  itemClassName = '',
}: {
  children: ReactNode[]
  step?: number
  base?: number
  variant?: RevealVariant
  className?: string
  itemClassName?: string
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <Reveal key={index} variant={variant} delay={base + index * step} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </div>
  )
}
