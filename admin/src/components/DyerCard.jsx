import React from 'react'
import { useContext,  } from 'react'
import { AdminContext } from '../context/AdminContext'

const DyerCard = ({id, company_name, proprietor_name, phone}) => {
    const {navigate}=useContext(AdminContext);
  return (
    <div>
      <div className={'grid grid-cols-5 item-center p-4 m-4 boderer-gray-300 rounded-lg shadow-lg '}>
        <p><span className="font-bold">Company id: </span> {id}</p>
        {/* <p><span className="font-bold">Company Type: </span> Dyer</p> */}
        <p><span className="font-bold">Company Name: </span> {company_name}</p>
        <p><span className="font-bold">Proprietor Name: </span> {proprietor_name}</p>
        <p><span className="font-bold">Phone: </span> {phone}</p>
        <button onClick={()=>{navigate(`/dyer/${id}`)}} className='bg-blue-500 text-white p-2 rounded cursor-pointer hover:opacity-70'>More Details</button>
    </div>
    </div>
  )
}

export default DyerCard
