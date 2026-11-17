// Official Spotify embed player. It is not part of the Web API, so it is not
// affected by the Development Mode restrictions. It plays full songs when the
// user is logged in to Spotify in the browser, and 30s previews otherwise.
export default function SpotifyEmbed({ type, id, height = 152 }) {
    if (!id) return null

    return (
        <iframe
            title={`Spotify ${type} player`}
            src={`https://open.spotify.com/embed/${type}/${id}`}
            width='100%'
            height={height}
            style={{ border: 0, borderRadius: '12px' }}
            allow='autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture'
            loading='lazy'
        />
    )
}
