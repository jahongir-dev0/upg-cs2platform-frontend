'use client'

import { useAuth } from './providers'
import { cn } from '@/lib/utils'

interface SteamLoginButtonProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'primary' | 'outline'
}

function SteamIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658a3.387 3.387 0 0 1 1.912-.59c.064 0 .128.002.192.006l2.862-4.146V8.87a4.528 4.528 0 0 1 4.524-4.524 4.528 4.528 0 0 1 4.524 4.524 4.528 4.528 0 0 1-4.524 4.524h-.105l-4.08 2.911c0 .052.004.105.004.159a3.392 3.392 0 0 1-3.39 3.39 3.406 3.406 0 0 1-3.329-2.727L.436 14.468C1.862 19.884 6.478 24 11.979 24c6.627 0 12-5.373 12-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61a2.542 2.542 0 0 0 4.884-.89 2.545 2.545 0 0 0-2.544-2.545c-.168 0-.333.018-.494.048l1.521.63a1.87 1.87 0 0 1-1.431 3.449l-.001-.001.038-.08zm8.415-5.606a3.016 3.016 0 0 0 3.013-3.013 3.016 3.016 0 0 0-3.013-3.013 3.016 3.016 0 0 0-3.013 3.013 3.016 3.016 0 0 0 3.013 3.013zm-.001-5.274a2.262 2.262 0 1 1 0 4.524 2.262 2.262 0 0 1 0-4.524z" />
    </svg>
  )
}

export function SteamLoginButton({
  size = 'md',
  className,
  variant = 'primary',
}: SteamLoginButtonProps) {
  const { steamLogin } = useAuth()

  const sizes = {
    sm: 'px-4 py-2 text-xs gap-2',
    md: 'px-5 py-2.5 text-sm gap-2.5',
    lg: 'px-6 py-3 text-sm gap-3',
  }

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  const variants = {
    primary:
      'bg-[#1b2838] text-white border border-[#2a475e] hover:bg-[#2a475e] hover:border-[#66c0f4] hover:shadow-[0_0_12px_rgba(102,192,244,0.3)]',
    outline:
      'border border-[#66c0f4]/50 text-[#66c0f4] hover:bg-[#66c0f4]/10 hover:border-[#66c0f4]',
  }

  return (
    <button
      onClick={steamLogin}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold uppercase tracking-wide transition-all duration-200',
        sizes[size],
        variants[variant],
        className,
      )}
    >
      <SteamIcon className={iconSizes[size]} />
      Steam orqali kirish
    </button>
  )
}
