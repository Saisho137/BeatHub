import Navbar from "./navbar"

export default function Layout({ children }) {
    return (
        <div className="body container-fluid p-0">
            <Navbar />
                <main className="main">{children}</main>
        </div>
    )
}