import { yearOf } from './format'

const countBy = (items, keyOf) => {
    const counts = {}
    items.forEach(item => {
        const key = keyOf(item)
        if (key != null) counts[key] = (counts[key] || 0) + 1
    })
    return counts
}

// Fill gaps so the time axis is continuous: { 2016: 3, 2018: 1 } -> 2016, 2017, 2018
const continuousRange = (counts, step) => {
    const keys = Object.keys(counts).map(Number)
    if (keys.length === 0) return []
    const result = []
    for (let key = Math.min(...keys); key <= Math.max(...keys); key += step) {
        result.push({ key, value: counts[key] || 0 })
    }
    return result
}

// tracks: items from /api/library
export function computeLibraryInsights(tracks) {
    if (tracks.length === 0) return null

    const byAdded = [...tracks].sort((a, b) => a.addedAt.localeCompare(b.addedAt))
    const releaseYears = tracks.map(t => yearOf(t.releaseDate)).filter(Boolean)
    const totalMs = tracks.reduce((sum, t) => sum + t.durationMs, 0)

    const artistCounts = {}
    tracks.forEach(t => t.artists.forEach(({ id, name }) => {
        artistCounts[id] = artistCounts[id] || { id, name, value: 0 }
        artistCounts[id].value++
    }))

    const savedPerYear = continuousRange(countBy(tracks, t => yearOf(t.addedAt)), 1)
    const busiestYear = savedPerYear.reduce((best, year) => year.value > best.value ? year : best, savedPerYear[0])

    const datedTracks = tracks.filter(t => yearOf(t.releaseDate))
    const oldestSong = datedTracks.reduce((oldest, t) => t.releaseDate < oldest.releaseDate ? t : oldest, datedTracks[0])

    return {
        total: tracks.length,
        totalMinutes: Math.round(totalMs / 60000),
        averageYear: releaseYears.length ? Math.round(releaseYears.reduce((a, b) => a + b, 0) / releaseYears.length) : null,
        explicitPercent: Math.round(100 * tracks.filter(t => t.explicit).length / tracks.length),
        uniqueArtists: Object.keys(artistCounts).length,
        topArtists: Object.values(artistCounts).sort((a, b) => b.value - a.value).slice(0, 10),
        savedPerYear,
        busiestYear,
        decades: continuousRange(countBy(releaseYears, year => Math.floor(year / 10) * 10), 10),
        firstSaved: byAdded[0],
        lastSaved: byAdded[byAdded.length - 1],
        oldestSong
    }
}
