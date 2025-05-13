import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'  
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Signup = () => {
  const {handleSignUp, navigate, backendUrl} = useContext(ShopContext);
  const [companyName, setCompanyName] = useState('')
  const [proprietorName, setProprietorName] = useState('')  
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
//   const [streetName, setStreetName] = useState('')
//   const [city, setCity] = useState('')
//   const [pincode, setPincode] = useState('')
  const [password, setPassword] = useState('')

  const createNotification=async () => {
    try {
        const token = localStorage.getItem('dyer-token')
        if (!token) {
            toast.error('Please login to continue')
            return
        }
        console.log('creating notification')
        const res = await axios.post(`${backendUrl}/notification/create`, {message: `New Dyer ${companyName} is requesting for approval`, isForAdmin: true, category: 'approve'}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        console.log('notification response',res.data)
        if (res.data.success) {
            // toast.success('Notification created successfully')
        } else {
            toast.error(res.data.message)
        }
    } catch (err) {
        // toast.error('Failed to create notification')
        console.error('notification failed',err)
        if (err.response && err.response.data) {
            toast.error(err.response.data.message)
        }
        console.error('Error details:', err.response ? err.response.data : err.message)
    }
  }
    

  const handleSubmit=async (e)=>{
    e.preventDefault();
    try{
        // const address={streetName, city, pincode,}
        // handleSignUp({companyName, proprietorName, email, phone, address, password}); 
        const userData={role:"dyer",companyName, proprietorName, email, phone, address, password}
        // console.log(userData);
        const response=await axios.post(`${backendUrl}/user/register`, userData)
        console.log(response.data);
        if (response.data.success){
            // console.log("hi")
            // await createNotification()
            // console.log("bye")
            navigate('/request-approval');
        }
        else{
            toast.error(response.data.message);
            console.log(response.data.message);
        }
        
        
    } catch (error) {
        console.log(error); // Optional: inspect full error
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error); // shows "user already exists"
          console.log(error.response.data.error);
        } else {
          toast.error("Something went wrong");
          console.log(error.message);
        }
    }
  }
    

  return (
    
    <div className=''>
        <div className='flex items-center justify-center mt-20'> 
            <div className='border border-gray-400 rounded-lg shadow-lg w-1/3'>
                <form className='flex flex-col items-center justify-center p-8' onSubmit={handleSubmit} >
                    <h1 className='text-2xl font-bold mb-4'>Sign Up</h1>
                    <input onChange={(e)=>setCompanyName(e.target.value)} type="text" placeholder='Company Name' className='border border-gray-300 p-2 mb-4 w-64' />
                    <input onChange={(e)=>setProprietorName(e.target.value)} type="text" placeholder='Proprietor Name' className='border border-gray-300 p-2 mb-4 w-64' />
                    <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email' className='border border-gray-300 p-2 mb-4 w-64' />
                    <input onChange={(e)=>setPhone(e.target.value)} type="phone" placeholder='Contact Number' className='border border-gray-300 p-2 mb-4 w-64' />
                    {/* <input onChange={(e)=>setStreetName(e.target.value)} type="text" placeholder='Street Name' className='border border-gray-300 p-2 mb-4 w-64' />
                    <input onChange={(e)=>setCity(e.target.value)} type="text" placeholder='City' className='border border-gray-300 p-2 mb-4 w-64' />
                    <input onChange={(e)=>setPincode(e.target.value)} type="Number" placeholder='Pincode' className='border border-gray-300 p-2 mb-4 w-64' /> */}
                    <textarea onChange={(e)=>setAddress(e.target.value)} type="text" placeholder='address' className='border border-gray-300 p-2 mb-4 w-64' />
                    <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' className='border border-gray-300 p-2 mb-4 w-64' />
                    <button className='bg-blue-500 text-white p-2 rounded' type='submit'>Request to Approve</button>
                    <p className='mt-2'>Already have an account? <a href="/signin" className='text-blue-500'>Sign In</a></p>
                    {/* <div className='mt-5 flex justify-between w-full'>  
                        <p>Forgot Password? <a href="/reset-password" className='text-blue-500' >Reset</a></p>
                        <p className='mt-2'>Already have an account? <a href="/signin" className='text-blue-500'>Sign In</a></p>
                    </div> */}
                </form>
            </div>
        </div>
    </div>
  )
}

export default Signup
