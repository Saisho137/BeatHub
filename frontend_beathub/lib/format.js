// "3:07"
export const formatDuration = (ms) => {
    const totalSeconds = Math.round(ms / 1000)
    return `${Math.floor(totalSeconds / 60)}:${String(totalSeconds % 60).padStart(2, '0')}`
}

// "2h 14m" / "45m"
export const formatHours = (minutes) => minutes >= 60
    ? `${Math.floor(minutes / 60)}h ${minutes % 60}m`
    : `${minutes}m`

// Spotify dates can be "YYYY", "YYYY-MM" or "YYYY-MM-DD"
export const formatReleaseDate = (date) => {
    if (!date) return null
    if (date.length < 10) return date.slice(0, 4)
    return new Date(`${date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export const yearOf = (date) => {
    const year = parseInt((date || '').slice(0, 4), 10)
    return year > 0 ? year : null
}

export const formatNumber = (value) => value.toLocaleString('en-US')
