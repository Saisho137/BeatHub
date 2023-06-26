import Navbar from "./navbar"

export default function Layout({ authEndpoint, clientId, redirectUri, responseType, scope, children }) {
    return (
        <div className="body container-fluid p-0">
            <Navbar
                authEndpoint={authEndpoint}
                clientId={clientId}
                redirectUri={redirectUri}
                responseType={responseType}
                scope={scope}
            />
                <main className="main">{children}</main>
        </div>
    )
}