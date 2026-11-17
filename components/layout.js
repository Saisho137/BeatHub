import Navbar from "./navbar"
import Footer from "./footer"

export default function Layout({ children }) {
    return (
        <div className="body container-fluid p-0 theme">
            <Navbar />
            <main className="main font" style={{ minHeight: '40em' }}>{children}</main>
            <Footer />
        </div>
    )
}
