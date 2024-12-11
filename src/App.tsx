import './App.css'
import Arbiter from './components/Arbiter/Arbiter'
import Footer from './Footer'
import Navbar from './Navbar'

// The app component
function App() {
  return (
    <div id='app'>
    <Navbar/>
    <div className="chessboard-container"><Arbiter /></div>
    <Footer/>
    </div>
  )
}

export default App
