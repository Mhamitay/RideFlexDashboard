import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import { createGlobalStyle, ThemeProvider } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  :root{
    --bg:#f6f9ff;
    --card:#ffffff;
    --accent:#1f6feb;
    --muted:#6b7280;
    --text:#0b1724;
  }
  body{font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;margin:0;background:linear-gradient(180deg,var(--bg),#ffffff);color:var(--text)}
`

const container = document.getElementById('root')
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <ThemeProvider theme={{}}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </React.StrictMode>
  )
} else {
  // eslint-disable-next-line no-console
  console.error('Root element not found: #root')
}
