'use client' // Required for hooks and interactivity

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname() // Correct hook for App Router

  // Navigation items configuration
  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      hoverColor: 'hover:text-blue-300'
    },
    {
      name: 'Compare',
      href: '/compare',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      hoverColor: 'hover:text-green-300'
    },
    {
      name: 'Portfolio',
      href: '/portfolio',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      hoverColor: 'hover:text-purple-300'
    },
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: (
        <img
          src="   https://cdn-icons-png.flaticon.com/512/11741/11741038.png "
          alt="Dashboard"
          className="h-4 w-4 mr-1.5"
        />
      ),
      hoverColor: 'hover:text-purple-300'
    }
    
  ]

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg backdrop-blur-sm">
      <div className="container mx-auto px-4 py-2.5">
        <div className="flex justify-between items-center">
          {/* Logo with enhanced hover effects */}
          <Link
            href="/"
            className="flex items-center space-x-1 group transition-all duration-300"
            aria-label="PortIQ Home"
          >
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 group-hover:from-blue-300 group-hover:to-purple-400 transition-all duration-300">
              PortIQ
            </span>
            <span className="hidden md:inline-block text-[10px] bg-blue-500/90 text-white px-1.5 py-0.5 rounded-full animate-pulse">
              Beta
            </span>
          </Link>

          {/* Navigation with active state indicators */}
          <nav className="flex items-center space-x-1 md:space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-300 flex items-center ${
                  pathname === item.href
                    ? 'bg-gray-700/50 text-white'
                    : 'text-gray-300 hover:bg-gray-700/30 ' + item.hoverColor
                }`}
                aria-current={pathname === item.href ? 'page' : undefined}
              >
                {item.icon}
                <span className="hidden sm:inline">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
