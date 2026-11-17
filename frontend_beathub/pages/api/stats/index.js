import { spotifyGet, sendSpotifyError } from "../../../lib/spotifyApi"
import { yearOf } from "../../../lib/format"

const PERIODS = ['short_term', 'medium_term', 'long_term']

const simplifyTrack = ({ id, name, album, artists }) => ({
    id,
    name,
    artists: artists.map(({ name }) => name),
    images: album.images[0]
})

const simplifyArtist = ({ id, name, images }) => ({ id, name, images: images[0] })

// Insights computed from the fields Spotify still returns for top tracks
const computeInsights = (tracks) => {
    if (tracks.length === 0) return null

    const years = tracks.map(t => yearOf(t.album.release_date)).filter(Boolean)
    const decades = {}
    years.forEach(year => {
        const decade = Math.floor(year / 10) * 10
        decades[decade] = (decades[decade] || 0) + 1
    })

    const artistCount = {}
    tracks.forEach(t => t.artists.forEach(({ id, name }) => {
        artistCount[id] = artistCount[id] || { id, name, count: 0 }
        artistCount[id].count++
    }))
    const topArtist = Object.values(artistCount).sort((a, b) => b.count - a.count)[0]

    const datedTracks = tracks.filter(t => yearOf(t.album.release_date))
    const byDate = [...datedTracks].sort((a, b) => a.album.release_date.localeCompare(b.album.release_date))
    const totalMs = tracks.reduce((sum, t) => sum + t.duration_ms, 0)

    return {
        trackCount: tracks.length,
        totalMinutes: Math.round(totalMs / 60000),
        averageDurationMs: Math.round(totalMs / tracks.length),
        averageYear: years.length ? Math.round(years.reduce((a, b) => a + b, 0) / years.length) : null,
        // Continuous decade axis: empty decades show as 0 instead of disappearing
        decades: years.length === 0 ? [] : Array.from(
            { length: (Math.floor(Math.max(...years) / 10) - Math.floor(Math.min(...years) / 10)) + 1 },
            (_, i) => {
                const decade = Math.floor(Math.min(...years) / 10) * 10 + i * 10
                return { decade, count: decades[decade] || 0 }
            }
        ),
        explicitPercent: Math.round(100 * tracks.filter(t => t.explicit).length / tracks.length),
        singlesPercent: Math.round(100 * tracks.filter(t => t.album.album_type === 'single').length / tracks.length),
        uniqueArtists: Object.keys(artistCount).length,
        topArtist,
        oldest: byDate[0] ? { ...simplifyTrack(byDate[0]), year: yearOf(byDate[0].album.release_date) } : null,
        newest: byDate.length ? { ...simplifyTrack(byDate[byDate.length - 1]), year: yearOf(byDate[byDate.length - 1].album.release_date) } : null
    }
}

// Items in the recent top that are not in the all-time top
const newEntries = (recent, allTime) => {
    const allTimeIds = new Set(allTime.map(item => item.id))
    return recent.filter(item => !allTimeIds.has(item.id))
}

// Items present in the top of every period
const presentInAll = (lists) => {
    const [first, ...rest] = lists
    return first.filter(item => rest.every(list => list.some(other => other.id === item.id)))
}

export default async function handler(req, res) {
    // Same shape as axios responses ({ data }) so the destructuring below stays simple
    const get = (path) => spotifyGet(path, req.headers.authorization).then(data => ({ data }))

    try {
        const [{ data: me }, { data: following }, { data: playlists }, { data: library }, ...tops] = await Promise.all([
            get(`/me`),
            get(`/me/following?type=artist&limit=1`),
            get(`/me/playlists?limit=1`),
            get(`/me/tracks?limit=1`),
            ...PERIODS.flatMap(period => [
                get(`/me/top/tracks?time_range=${period}&limit=50`),
                get(`/me/top/artists?time_range=${period}&limit=50`)
            ])
        ])

        const raw = {}
        PERIODS.forEach((period, i) => {
            raw[period] = {
                tracks: tops[i * 2].data.items,
                artists: tops[i * 2 + 1].data.items
            }
        })

        const periods = {}
        PERIODS.forEach(period => {
            const { tracks, artists } = raw[period]
            periods[period] = {
                tracks: tracks.map(simplifyTrack),
                artists: artists.map(simplifyArtist),
                insights: computeInsights(tracks)
            }
        })

        const short = periods.short_term
        const long = periods.long_term
        const comparison = {
            newArtists: newEntries(short.artists, long.artists).slice(0, 10),
            newTracks: newEntries(short.tracks, long.tracks).slice(0, 10),
            loyalArtists: presentInAll(PERIODS.map(p => periods[p].artists)).slice(0, 10)
        }

        res.status(200).send({
            user: {
                id: me.id,
                display_name: me.display_name,
                images: me.images,
                followedArtists: following.artists.total,
                playlists: playlists.total,
                savedTracks: library.total
            },
            periods,
            comparison
        })
    }
    catch (error) {
        sendSpotifyError(res, error)
    }
}
