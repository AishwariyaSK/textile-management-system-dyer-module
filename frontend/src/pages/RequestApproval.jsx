import React from 'react'
import { useNavigate } from 'react-router-dom'

const RequestApproval = () => {
  const navigate=useNavigate();
  return (
    <div>
      <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
        <h1 className='text-2xl font-bold mb-4'>Your Request for Approval is sent to the admin</h1>
        <h1 className='text-2xl font-bold mb-4'>Your details will be reviewed and approved within 2 days</h1>
        <p className='text-xl text-blue-700 hover:underline cursor-pointer' onClick={()=>navigate('/signin')}>Go back to signin</p>
      </div>
    </div>
    
  )
}

export default RequestApproval
