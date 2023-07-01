
const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4">
        <div className="container">
            <div className="row justify-content-between">
            <div className="col-md-6">
                <h5 className="fs-4">🟢BeatHub</h5>
                <p>Our project connects to your Spotify account and provides personalized music recommendations based on your favorite artists, songs, and genres. Discovering new music and putting your musical knowledge to the test has never been easier. Explore a world of endless musical possibilities and expand your horizons with our innovative platform.</p>
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