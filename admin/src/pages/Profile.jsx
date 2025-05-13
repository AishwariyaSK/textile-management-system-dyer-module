import React from 'react'
// import { useContext } from 'react'
// import { ShopContext } from '../context/ShopContext'
// import { useEffect, useState } from 'react'
// import {toast} from 'react-toastify'
// import axios from 'axios'

const Profile = () => {
  // const {userDetails, navigate, backendUrl}=useContext(ShopContext);
  // const [user, setUser] = useState(userDetails);

  // const fetchUserDetails=async()=>{
  //   const token=localStorage.getItem("dyer-token");
  //   if (!token){
  //     toast.error("Please login first");
  //     return;
  //   }
  //   try{
  //     const response=await axios.get(`${backendUrl}/user/getUser/${userDetails._id}`,{headers: {
  //       Authorization: `Bearer ${token}`
  //     }})
  //     if (response.data.success){
  //       setUser(response.data.user);
  //     }
  //     else{
  //       toast.error(response.data.message);
  //     }
  //   }catch(error){
  //     console.log(error);
  //     if (error.response && error.response.data && error.response.data.message) {
  //       toast.error(error.response.data.message); 
  //       console.log(error.response.data.message);
  //     } else {
  //       toast.error("Something went wrong");
  //       console.log(error.message);
  //     }
  //   }
  // }

  // useEffect(() => {
  //   fetchUserDetails();
  // }, [])
  
  
  
  return (
    <div className=''>
        
        <div className='flex items-center justify-center mt-20'> 
            <div className='flex flex-col p-4 items-center justify-center border border-gray-400 rounded-lg shadow-lg w-1/3'>
              <div className='border border-gray-300 p-2 mb-4 w-full'><span className='font-bold'>Company Name: </span>Kumarakuru Tex</div> 
              <div className='border border-gray-300 p-2 mb-4 w-full'><span className="font-bold">Proprietor Name:</span> Sivasubramanium</div>
              <div className='border border-gray-300 p-2 mb-4 w-full'><span className="font-bold">Email:</span> kumarakurutex@gmail.com</div>
              <div className='border border-gray-300 p-2 mb-4 w-full'><span className="font-bold">Contact Details:</span> 9790067090</div>
              <div className='border border-gray-300 p-2 mb-4 w-full'><span className="font-bold">Adress:</span> No,. 444/1, Senthil Nagar Layout, Nallur, Tirupur, 641604</div>
              {/* <button className='bg-blue-500 text-white p-2 rounded' type='submit'>Update Profile</button> */}
            </div>
        </div>
    </div>
  )
}

export default Profile
