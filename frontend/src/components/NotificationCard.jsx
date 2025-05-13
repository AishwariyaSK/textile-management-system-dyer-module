import React from 'react'
import { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'
import axios from 'axios'


const NotificationCard = ({id, userId, isForAdmin, batchId, message, seen, dateTime, category, onDelete}) => {
    const {backendUrl, navigate} = useContext(ShopContext)

    const handleView=async () => {
        try{
            await handleMarkAsRead()
            // console.log(category)

            // if (category === 'approve') {
            //     navigate('/approve-dyer')
            // } 
            if (category === 'status update') {
                navigate(`/batch/${batchId}`)
            } 
            // else if (category === 'payment pending') {
            //     navigate(`/batch/${batchId}`)
            // } 
            else if (category === 'payment received') {
                navigate(`/batch/${batchId}`)
            } 
            else if (category === 'order placed') {
                navigate(`/batch/${batchId}`)
            }

            
        }catch(err) {
            toast.error('Failed to view notification')
        }
    }

    const handleMarkAsRead=async () => {
        try {
            const token = localStorage.getItem('dyer-token')
            if (!token) {
                toast.error('Please login to continue')
                return
            }
            const res = await axios.patch(`${backendUrl}/notification/markAsRead/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success) {
                // toast.success('Notification marked as seen')
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            toast.error('Failed to mark notification as seen')
            console.error(err)
        }
    }

    const handleDelete=async () => {
        try {
            const token = localStorage.getItem('dyer-token')
            if (!token) {
                toast.error('Please login to continue')
                return
            }
            const res = await axios.delete(`${backendUrl}/notification/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.data.success) {
                // toast.success('Notification deleted successfully')
                onDelete()
            } else {
                toast.error(res.data.message)
            }
        } catch (err) {
            toast.error('Failed to delete notification')
            console.error(err)
           
        }
    }
    
    return (
        <div className={`border p-4 grid grid-cols-4 place-items-center rounded-md shadow-sm mb-4 ${seen ? 'bg-white' : 'bg-blue-50'}`}>
          <div className={`text-gray-800 ${!seen ? 'font-bold' : 'font-normal'}`}>
            {message}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {new Date(dateTime).toLocaleString()} 
          </div>

          <div className="text-sm text-gray-500 mt-1">
            {category} 
          </div>
    
          <div className="mt-3 flex space-x-3">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              onClick={() => handleView()}
            >
              View
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => handleDelete()}
            >
              Delete
            </button>
          </div>
        </div>
    );
    
}

export default NotificationCard
