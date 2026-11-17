import { useEffect, useState } from 'react'

const SunIcon = () => (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' aria-hidden='true'>
        <circle cx='12' cy='12' r='4' />
        <path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41' />
    </svg>
)

const MoonIcon = () => (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' aria-hidden='true'>
        <path d='M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z' />
    </svg>
)

const applyTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-bs-theme', theme)
    try { localStorage.setItem('selectedTheme', theme) } catch { /* storage unavailable */ }
}

// Dark is the default; the initial theme is applied before paint in pages/_document.js
export default function ThemeToggle() {
    const [theme, setTheme] = useState('dark')

    useEffect(() => {
        setTheme(document.documentElement.getAttribute('data-theme') || 'dark')
    }, [])

    const toggle = () => {
        const next = theme === 'dark' ? 'light' : 'dark'
        applyTheme(next)
        setTheme(next)
    }

    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    return (
        <button type='button' className='icon-button' onClick={toggle} aria-label={label} title={label}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
    )
}
