import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext';

const BatchCard = ({ id,status, company_name, fd_date, d_date, sdp_date, rdp_date, products} ) => {
    const {navigate}=useContext(AdminContext);
  return (    
    <div className={`grid grid-cols-[3fr_2fr_3fr_2fr] item-center p-4 m-4 boderer-gray-300 rounded-lg shadow-lg ${status=='transaction completed' ? 'bg-gray-300' : ""} `}>
        <p><span className="font-bold">Batch id: </span> {id}</p>
        <p><span className="font-bold">Dyer Company: </span> {company_name}</p>
        <p className='flex flex-row'><span className="font-bold">Status: </span> {status}</p>
        <button onClick={()=>{navigate(`/batch/${id}`)}} className='bg-blue-500 text-white p-2 rounded cursor-pointer hover:opacity-70'>More Details</button>
    </div>
  )
}

export default BatchCard
