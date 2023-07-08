import Navbar from "./navbar"
import Footer from "./footer"
import DarkMode from "./darkMode"

export default function Layout({ children }) {
    return (
        <div className="body container-fluid p-0 theme">
            <Navbar />
            <DarkMode />
                <main className="main" style={{minHeight: '38rem'}}>{children}</main>
            <Footer />
        </div>
    )
}