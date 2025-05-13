import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Home from './pages/Home'
import BatchDetail from './pages/BatchDetail'
import TrackOrder from './pages/TrackOrder'
import NavBar from './components/NavBar'
import RequestApproval from './pages/RequestApproval'
import Notification from './pages/Notification'


function App() {

  return (
    <div>
      <ToastContainer/>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/batch/:id" element={<BatchDetail />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/request-approval" element={<RequestApproval/>} />
        <Route path="/notification" element={<Notification />} />
        <Route path="*" element={<h1>Page not found</h1>} />
      </Routes>
    </div>
  )
}

export default App
