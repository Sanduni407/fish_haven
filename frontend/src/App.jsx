import React from 'react'
import { Routes , Route} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import{ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Home from './pages/Home/Home'

const App = () => {
  return (
    <div>
        <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
      </Routes>
    </div>
  )
}

export default App