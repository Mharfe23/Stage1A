// import { useState } from 'react'
import Welcome from './pages/Welcome/Welcome'
import Login from './pages/Login/login'
import Signup from './pages/Signup/Signup'
import { useAuthContext } from './Context/AuthContext'
import Home from './pages/Home/Home'
import HomeInv from './pages/Bus&Rep/Home/HomeInv';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {Toaster} from 'react-hot-toast';
import SignupInv from './pages/Bus&Rep/Signup/SignupInv'

function App() {

const {authUser} = useAuthContext();
//h-screen instead of h-full
const loginfunc = () => {
  if (authUser) {
    if (authUser.organizer_id) {
        return <Navigate to="/home" />
      } else if (authUser.userid || authUser.business_id) {
        return <Navigate to="/inv/home" />
      }
  }
  return <Login/>
}

  return (
    <div className=' bg-gray-100 h-full'>
       <Router>
        <Routes>
          <Route path='/' element={<Welcome />} />
          {/*<Route path='/login' element={(authUser && authUser.organizer_id) ? <Navigate to="/home"/>:<Login />} />*/}
          <Route path='/login' element={loginfunc()} />
          <Route path='/signup' element={(authUser && authUser.organizer_id) ? <Navigate to="/home"/>:<Signup/>} />
          <Route path='/home/*' element={(authUser && authUser.organizer_id )? <Home/>:<Navigate to="/"/>}/>
          <Route path='/inv/home/*' element={(authUser && (authUser.userid || authUser.business_id) )? <HomeInv/>:<Navigate to="/"/>}/>
          <Route path='/signup/inv' element={(authUser && authUser.userid) ? <Navigate to="/inv/home"/>:<SignupInv/>} />
          
        </Routes>
      </Router>
    <Toaster />

    </div>
    
    
  )
}

export default App
