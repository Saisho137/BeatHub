// Small browser cache to avoid repeating Spotify requests (Development Mode has a
// shared quota per developer account). Values are stored with their save time.
const PREFIX = 'beathub:cache:'

const storageFor = (type) => {
    try {
        return type === 'session' ? window.sessionStorage : window.localStorage
    } catch {
        return null // storage blocked (private mode, disabled cookies...)
    }
}

// Returns { value, savedAt } when the entry exists and is younger than maxAgeMs
export function readCache(key, maxAgeMs, type = 'local') {
    const storage = storageFor(type)
    if (!storage) return null
    try {
        const raw = storage.getItem(PREFIX + key)
        if (!raw) return null
        const entry = JSON.parse(raw)
        if (Date.now() - entry.savedAt > maxAgeMs) return null
        return entry
    } catch {
        return null
    }
}

export function writeCache(key, value, type = 'local') {
    const storage = storageFor(type)
    if (!storage) return
    try {
        storage.setItem(PREFIX + key, JSON.stringify({ savedAt: Date.now(), value }))
    } catch {
        // storage full: caching is an optimization, never an error
    }
}

// Called on login/logout so another account never sees cached data
export function clearCaches() {
    for (const type of ['local', 'session']) {
        const storage = storageFor(type)
        if (!storage) continue
        try {
            Object.keys(storage).filter(key => key.startsWith(PREFIX)).forEach(key => storage.removeItem(key))
        } catch {
            // ignore
        }
    }
}

export const MINUTE = 60 * 1000
export const HOUR = 60 * MINUTE
