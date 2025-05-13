import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';


const BatchCard = ({ id,status, products, companyName, targetDeliveryDate, purchaseDate} ) => {
    const {navigate}=useContext(ShopContext);
  return (    
    <div className={`grid grid-cols-[3fr_2fr_3fr_2fr] item-center p-4 m-4 boderer-gray-300 rounded-lg shadow-lg ${status=='transaction completed' ? 'bg-gray-300' : ""} `}>
        <p><span className="font-bold">Batch id:</span> {id}</p>
        <p><span className="font-bold">Status:</span> {status}</p>
        <p><span className="font-bold">Target Delivery Date:</span> {new Date(targetDeliveryDate).toLocaleDateString() }</p>
        <button onClick={()=>{navigate(`/batch/${id}`)}} className='bg-blue-500 text-white p-2 rounded cursor-pointer hover:opacity-70'>More Details</button>
    </div>
  )
}

export default BatchCard
