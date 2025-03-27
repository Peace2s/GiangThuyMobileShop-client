import { useState } from 'react'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import MainContent from './components/layout/MainContent'
import Footer from './components/layout/Footer'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="app">
      <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="main-container">
        <Sidebar />
        <MainContent />
      </div>
      <Footer />
    </div>
  )
}

export default App