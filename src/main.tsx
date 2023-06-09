import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './polyfill/index.ts'
import './style/reset.css'
import './assets/iconfont/iconfont.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />,
)
