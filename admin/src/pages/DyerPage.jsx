import React from 'react'
import { useContext, useEffect,useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import DyerCard from '../components/DyerCard'
import { toast } from 'react-toastify'
import axios from 'axios'

const DyerPage = () => {
  // const { dyer } = useContext(AdminContext)

  const { backendUrl } = useContext(AdminContext)
  const [dyer, setDyer] = useState([])
  const fetchDyer = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Please login first')
      return
    }
    try {
      const response = await axios.get(`${backendUrl}/user/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.data.success) {
        const filteredDyer = response.data.users.filter(user => user.role === 'dyer')
        setDyer(filteredDyer)
        // setDyer(response.data.dyer)
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
        console.log(error.response.data.message)
      } else {
        toast.error('Something went wrong')
      }
    }
  }
  useEffect(() => {
    fetchDyer()
  }, [])

  return (
    <div>
        {dyer.map((dy, index) => (
          <DyerCard
            key={index}
            id={dy._id}
            role={dy.role}
            company_name={dy.companyName}
            proprietor_name={dy.proprietorName}
            phone={dy.phone}
          />
        ))}
    </div>
  )
}

export default DyerPage
