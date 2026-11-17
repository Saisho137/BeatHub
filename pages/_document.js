import { Html, Head, Main, NextScript } from 'next/document'

// Applies the saved theme (dark by default) before the first paint, so there is no light flash.
// data-theme drives our CSS tokens; data-bs-theme switches Bootstrap 5.3 components.
const themeScript = `
(function () {
  var theme = 'dark';
  try { theme = localStorage.getItem('selectedTheme') || 'dark'; } catch (e) {}
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-bs-theme', theme);
})();
`

export default function Document() {
    return (
        <Html lang='en' data-theme='dark' data-bs-theme='dark'>
            <Head />
            <body>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}
