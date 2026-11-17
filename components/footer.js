import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="app-footer py-5 font" style={{ position: 'relative', zIndex: '2' }}>
      <div className="container">
        <div className="row justify-content-between gy-4">
          <div className="col-md-6">
            <h5 className="fs-4 d-flex align-items-center gap-2">
              <img src='/favicon.svg' width='28' height='28' alt='' />
              BeatHub
            </h5>
            <p className="mb-2">Your listening statistics: top songs and artists, how your taste changes over time, your library and the decades you listen to. You can also explore and play any song, album or artist.</p>
            <p className="small mb-0">Music data and playback provided by Spotify. BeatHub is not affiliated with Spotify.</p>
          </div>
          <div className="col-md-3">
            <h5>Links</h5>
            <ul className="list-unstyled d-grid gap-1 mb-0">
              <li><Link href="/">Home</Link></li>
              <li><a href="https://github.com/Saisho137/BeatHub" target="_blank" rel="noreferrer">Repository</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
export default Footer
