import React from 'react'
import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const Signin = () => {
    const {backendUrl, navigate, userDetails, setUserDetails} = useContext(ShopContext);
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");

    
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            // handleLogin({email,password}); 
            // console.log("userDetails", userDetails);

            const userData={email, password}
            const response=await axios.post(`${backendUrl}/user/login`, userData)
            if (response.data.success){
                const token=response.data.token;
                localStorage.setItem("dyer-token", token);
                setUserDetails(response.data.user);
                navigate('/')
            }
            else{
                console.log(response.data.message);
                toast.error(response.data.message);
            }
  

        } catch (error) {
            console.log(error); 
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error); 
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
                    <h1 className='text-2xl font-bold mb-4'>Sign In</h1>
                    <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder='Email' className='border border-gray-300 p-2 mb-4 w-64' />
                    <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder='Password' className='border border-gray-300 p-2 mb-4 w-64' />
                    <button className='bg-blue-500 text-white p-2 rounded' type='submit'>Sign In</button>
                    <p className='mt-2'>Don't have an account? <a href="/signup" className='text-blue-500'>Sign Up</a></p>
                    {/* <div className='mt-5 flex justify-between w-full'>  
                        <p>Forgot Password? <a href="/reset-password" className='text-blue-500' >Reset</a></p>
                        <p>Don't have an account? <a href="/signup" className='text-blue-500'>Sign Up</a></p>
                    </div> */}
                </form>
            </div>
        </div>
    </div>

  )
}

export default Signin
