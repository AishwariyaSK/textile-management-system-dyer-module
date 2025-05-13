import React from 'react'

const dyerData=[
    {
        _id:"1",
        company_name:"abc",
        proprietor_name:"aaa",
        phone:"1234567890",
        email:"abc@gmail.com",
        password:"12345",
        address:"eruviuyriwcurwor",
        approved:true,
    },
    {
        _id:"2",
        company_name:"def",
        proprietor_name:"aaa",
        phone:"1234567890",
        email:"def@gmail.com",
        password:"12345",
        address:"eruviuyriwcurwor",
        approved:true,
    },
    {
        _id:"3",
        company_name:"ghi",
        proprietor_name:"aaa",
        phone:"1234567890",
        email:"ghi@gmail.com",
        password:"12345",
        address:"eruviuyriwcurwor",
        approved:true,
    },
    {
        _id:"4",
        company_name:"jkl",
        proprietor_name:"aaa",
        phone:"1234567890",
        email:"jkl@gmail.com",
        address:"eruviuyriwcurwor",
        approved:false,
    },
]

const batchData= [
    {
      _id: "1",
      company_name: "abc",
      status: "sent dyed product",
      sfd_date: "2023-06-11T10:43:21.000Z",
      rfd_date: null,
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "men", sub_category: "pant", quantity: 15, color: "black", size: "M", price: 150 }
      ],
      total_cost: 2250
    },
    {
      _id: "2",
      company_name: "def",
      status: "received for dyeing",
      sfd_date: "2023-03-18T11:00:00.000Z",
      rfd_date: "2023-03-22T09:30:00.000Z",
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "women", sub_category: "kurta", quantity: 10, color: "red", size: "L", price: 200 },
        { category: "women", sub_category: "shawl", quantity: 5, color: "white", size: "M", price: 250 }
      ],
      total_cost: 3250
    },
    {
      _id: "3",
      company_name: "ghi",
      status: "sent for dyeing",
      sfd_date: "2023-02-15T08:00:00.000Z",
      rfd_date: null,
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "kids", sub_category: "shirt", quantity: 20, color: "blue", size: "S", price: 90 }
      ],
      total_cost: 1800
    },
    {
      _id: "4",
      company_name: "abc",
      status: "received dyed product",
      sfd_date: "2023-01-20T09:10:00.000Z",
      rfd_date: "2023-01-22T10:15:00.000Z",
      sdp_date: "2023-01-25T11:30:00.000Z",
      rdp_date: "2023-01-28T14:00:00.000Z",
      products: [
        { category: "others", sub_category: null, quantity: 5, color: "green", size: "L", price: 400 }
      ],
      total_cost: 2000
    },
    {
      _id: "5",
      company_name: "def",
      status: "sent for dyeing",
      sfd_date: "2023-04-05T12:00:00.000Z",
      rfd_date: null,
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "men", sub_category: "shirt", quantity: 12, color: "white", size: "XL", price: 120 }
      ],
      total_cost: 1440
    },
    {
      _id: "6",
      company_name: "ghi",
      status: "sent dyed product",
      sfd_date: "2023-07-12T10:00:00.000Z",
      rfd_date: "2023-07-14T13:00:00.000Z",
      sdp_date: "2023-07-20T09:00:00.000Z",
      rdp_date: null,
      products: [
        { category: "women", sub_category: "pant", quantity: 8, color: "blue", size: "M", price: 180 }
      ],
      total_cost: 1440
    },
    {
      _id: "7",
      company_name: "abc",
      status: "received dyed product",
      sfd_date: "2023-03-01T08:00:00.000Z",
      rfd_date: "2023-03-03T08:00:00.000Z",
      sdp_date: "2023-03-07T10:00:00.000Z",
      rdp_date: "2023-03-10T11:00:00.000Z",
      products: [
        { category: "kids", sub_category: "pant", quantity: 14, color: "yellow", size: "S", price: 70 }
      ],
      total_cost: 980
    },
    {
      _id: "8",
      company_name: "def",
      status: "received for dyeing",
      sfd_date: "2023-06-02T09:30:00.000Z",
      rfd_date: "2023-06-05T10:45:00.000Z",
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "women", sub_category: "shawl", quantity: 6, color: "black", size: "L", price: 300 }
      ],
      total_cost: 1800
    },
    {
      _id: "9",
      company_name: "ghi",
      status: "sent for dyeing",
      sfd_date: "2023-05-20T10:15:00.000Z",
      rfd_date: null,
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "men", sub_category: "pant", quantity: 10, color: "red", size: "M", price: 160 }
      ],
      total_cost: 1600
    },
    {
      _id: "10",
      company_name: "abc",
      status: "transaction completed",
      sfd_date: "2023-09-01T10:00:00.000Z",
      rfd_date: "2023-09-03T11:00:00.000Z",
      sdp_date: "2023-09-07T12:00:00.000Z",
      rdp_date: null,
      products: [
        { category: "others", sub_category: null, quantity: 7, color: "white", size: "S", price: 350 }
      ],
      total_cost: 2450
    },
    {
      _id: "11",
      company_name: "def",
      status: "received dyed product",
      sfd_date: "2023-08-12T13:00:00.000Z",
      rfd_date: "2023-08-14T14:00:00.000Z",
      sdp_date: "2023-08-18T10:00:00.000Z",
      rdp_date: "2023-08-20T10:00:00.000Z",
      products: [
        { category: "women", sub_category: "kurta", quantity: 9, color: "blue", size: "M", price: 220 }
      ],
      total_cost: 1980
    },
    {
      _id: "12",
      company_name: "ghi",
      status: "sent for dyeing",
      sfd_date: "2023-02-20T10:00:00.000Z",
      rfd_date: null,
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "kids", sub_category: "shirt", quantity: 16, color: "green", size: "XS", price: 100 }
      ],
      total_cost: 1600
    },
    {
      _id: "13",
      company_name: "abc",
      status: "received for dyeing",
      sfd_date: "2023-03-10T09:00:00.000Z",
      rfd_date: "2023-03-12T10:00:00.000Z",
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "men", sub_category: "shirt", quantity: 20, color: "red", size: "M", price: 110 }
      ],
      total_cost: 2200
    },
    {
      _id: "14",
      company_name: "def",
      status: "sent dyed product",
      sfd_date: "2023-06-25T11:00:00.000Z",
      rfd_date: "2023-06-28T11:30:00.000Z",
      sdp_date: "2023-07-02T13:00:00.000Z",
      rdp_date: null,
      products: [
        { category: "women", sub_category: "pant", quantity: 10, color: "yellow", size: "L", price: 180 }
      ],
      total_cost: 1800
    },
    {
      _id: "15",
      company_name: "ghi",
      status: "received dyed product",
      sfd_date: "2023-04-01T09:00:00.000Z",
      rfd_date: "2023-04-03T10:00:00.000Z",
      sdp_date: "2023-04-06T10:00:00.000Z",
      rdp_date: "2023-04-08T10:00:00.000Z",
      products: [
        { category: "others", sub_category: null, quantity: 3, color: "black", size: "XL", price: 500 }
      ],
      total_cost: 1500
    },
    {
      _id: "16",
      company_name: "abc",
      status: "sent for dyeing",
      sfd_date: "2023-01-25T10:00:00.000Z",
      rfd_date: null,
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "men", sub_category: "pant", quantity: 9, color: "green", size: "L", price: 170 }
      ],
      total_cost: 1530
    },
    {
      _id: "17",
      company_name: "def",
      status: "received for dyeing",
      sfd_date: "2023-05-01T08:00:00.000Z",
      rfd_date: "2023-05-03T09:00:00.000Z",
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "kids", sub_category: "pant", quantity: 7, color: "blue", size: "XS", price: 80 }
      ],
      total_cost: 560
    },
    {
      _id: "18",
      company_name: "ghi",
      status: "sent dyed product",
      sfd_date: "2023-08-20T10:00:00.000Z",
      rfd_date: "2023-08-22T11:00:00.000Z",
      sdp_date: "2023-08-25T14:00:00.000Z",
      rdp_date: null,
      products: [
        { category: "women", sub_category: "shawl", quantity: 4, color: "white", size: "M", price: 300 }
      ],
      total_cost: 1200
    },
    {
      _id: "19",
      company_name: "abc",
      status: "received dyed product",
      sfd_date: "2023-07-15T09:00:00.000Z",
      rfd_date: "2023-07-18T10:00:00.000Z",
      sdp_date: "2023-07-20T12:00:00.000Z",
      rdp_date: "2023-07-23T13:00:00.000Z",
      products: [
        { category: "men", sub_category: "shirt", quantity: 6, color: "black", size: "S", price: 130 }
      ],
      total_cost: 780
    },
    {
      _id: "20",
      company_name: "def",
      status: "sent for dyeing",
      sfd_date: "2023-09-10T09:00:00.000Z",
      rfd_date: null,
      sdp_date: null,
      rdp_date: null,
      products: [
        { category: "women", sub_category: "kurta", quantity: 11, color: "red", size: "M", price: 210 }
      ],
      total_cost: 2310
    }
];


export {dyerData, batchData};
