export default function Layout({ children }) {
    return (
        <div className="body">
            <main className="main">{children}</main>
        </div>
    )
}