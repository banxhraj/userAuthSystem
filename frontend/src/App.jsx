import React from 'react'
import { Routes ,Route} from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import Login from './pages/Login'
import Verify from './pages/Verify'
import Resetpassword from './pages/Resetpassword'


const App = () => {
  return (
    <div>

        <Routes>
            <Route path='/' element={<HomePage/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/email-verify' element={<Verify/>}/>
            <Route path='/reset-password' element={<Resetpassword/>}/>
        </Routes>
    </div>
  )
}

export default App