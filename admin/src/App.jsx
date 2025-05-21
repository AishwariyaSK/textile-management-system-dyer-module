import { useState } from 'react'
import {ToastContainer} from 'react-toastify'
import {Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import Profile from './pages/Profile'
import PlaceDyeOrder from './pages/PlaceDyeOrder'
import DyerPage from './pages/DyerPage'
import DyerDetail from './pages/DyerDetail'
import BatchDetail from './pages/BatchDetail'
import ApproveDyer from './pages/ApproveDyer'
import NavBar from './components/Navbar'
import Notification from './pages/Notification'
import NotificationListener from './components/NotificationListener';
import { AdminContext } from './context/AdminContext';
import { useContext } from 'react'





function App() {
  const { backendUrl } = useContext(AdminContext);
  
  return (
    <div>
      <ToastContainer/>
      <NavBar/>
      <NotificationListener backendUrl={backendUrl} /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/profile' element={<Profile/>} />
        <Route path='/place-dye-order' element={<PlaceDyeOrder/>} />
        <Route path='/dyer-list' element={<DyerPage/>} />
        <Route path='/dyer/:id' element={<DyerDetail/>} />
        <Route path='/batch/:id' element={<BatchDetail/>} />
        <Route path='/approve-dyer' element={<ApproveDyer/>} />   
        <Route path='/notification' element={<Notification/>} />   
        
      </Routes>
    </div>
  )
}

export default App
