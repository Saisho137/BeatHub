const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 font" style={{ position: 'relative', zIndex:'2'}}>
        <div className="container">
            <div className="row justify-content-between">
            <div className="col-md-6">
                <h5 className="fs-4">BeatHub</h5>
                <p>Our project connects to your Spotify account to show your listening statistics: your top songs and artists, how your taste changes over time and the decades you listen to. You can also explore and play any song or artist. Explore a world of endless musical possibilities and expand your horizons with our innovative platform.</p>
            </div>
            <div className="col-md-3 ">
                <h5>Links</h5>
                <ul className="list-unstyled">
                <li><a href="#" style={{textDecoration: 'none'}}>Home</a></li>
                <li><a href="#" style={{textDecoration: 'none'}}>About</a></li>
                <li><a href="https://github.com/Saisho137/BeatHub" style={{textDecoration: 'none'}}>Repository</a></li>
                <li><a href="#" style={{textDecoration: 'none'}}>Contact</a></li>
                </ul>
            </div>
            </div>
        </div>
    </footer>
  )
}
export default Footer