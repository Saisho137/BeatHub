export default function Layout({ children }) {
    return (
        <div className="body container-fluid">
            <main className="main">{children}</main>
        </div>
    )
}