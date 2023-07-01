import Navbar from "./navbar"
import Footer from "./footer"

export default function Layout({ children }) {
    return (
        <div className="body container-fluid p-0">
            <Navbar />
                <main className="main" style={{minHeight: '46rem'}}>{children}</main>
            <Footer />
        </div>
    )
}