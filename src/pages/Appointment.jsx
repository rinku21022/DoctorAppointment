import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import RelatedDoctors from '../components/RelatedDoctors'

const Appointment = () => {

  const { docId}=useParams()
  const {doctors,currencySymbol}=useContext(AppContext)
  const dayOfWeek=['SUN','MON','TUE','WED','THU','FRI','SAT']

const [docInfo,setDocInfo]= useState(null)
const [docSlots,setDocSlots]=useState([])
const [slotIndex,setSlotIndex]=useState(0)
const [slotTime,setSlotTime]=useState('')


const fetchDocInfo = async () => {
  const docInfo= doctors.find(doc=> doc._id=== docId)
  setDocInfo(docInfo)
  
}

const getAvailableSlots = async () => {
  setDocSlots([]); // Reset slots

  // Getting current date
  let today = new Date();

  for (let i = 0; i < 7; i++) {
    let currentDate = new Date(today);
    currentDate.setDate(today.getDate() + i);  // Set the date for each day

    // Set the endTime for the current day (10 PM on that day)
    let endTime = new Date(currentDate);
    endTime.setHours(21, 0, 0, 0);  // Set endTime to 10 PM of the current date

    // If it's the current day, set the start time based on current time
    if (i === 0) {
      currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10);
      currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
    } else {
      // For future days, start at 10 AM
      currentDate.setHours(10);
      currentDate.setMinutes(0);
    }

    let timeSlots = [];
    while (currentDate < endTime) {
      let formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      timeSlots.push({
        datetime: new Date(currentDate),  // Correct the datetime key
        time: formattedTime
      });

      // Increment by 30 minutes
      currentDate.setMinutes(currentDate.getMinutes() + 30);
    }

    // Update the slots once for the entire loop
    setDocSlots(prev => ([...prev, timeSlots]));
  }
};


useEffect(()=>{
  fetchDocInfo()
},[doctors,docId])

useEffect(()=>{
  getAvailableSlots()
},[docInfo])

useEffect(()=>{
  console.log(docSlots)
},[docSlots])

return docInfo && (
  <div>
    {/*-------------doctor details---*/}
    <div className='flex flex-col sm:flex-row gap-4'>
      <div>
        <img className='bg-primary w-full sm:max-w-72 rounded-lg' src={docInfo.image} alt="" />
      </div>
      <div className='flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:m-0'>
        {/*-------doc info,degree,exp------*/}
        <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInfo.name} 
          <img className='w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className='py-0.5 px-2 border tect-xs rounded-full'>{docInfo.experience}</button>
          </div>
          {/*--------doc about----*/}
          <div>
            <p className='flex items-center gap-1 text-sm font-medium text-gray-900 mt-3'>About <img src={assets.info_icon} alt="" />
            </p>
            <p className='text-sm text-gray-500 max-w-[-700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className='text-gray-500 font-medium mt-4'>
            Appointment fee: <span className='text-gray-600'>{currencySymbol}{docInfo.fees}</span>
          </p>
      </div>
    </div>
    {/*----booking slot--*/}
    <div className='sm:ml-72 sm:;pl-4  mt-4 font-medium text-gray-700'>
      <p>Booking slots</p>
      <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
        {
          docSlots.length && docSlots.map((item,index)=> (
          <div onClick={()=> setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? 'bg-primary text-white' : 'border border-gray-200'}`} key={index}>
            <p>{item[0] && dayOfWeek[item[0].datetime.getDay()]}</p>
            <p> {item[0] && item[0].datetime.getDate()} </p>
          </div>

        ))
      }
      </div>
      <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4'>
        {docSlots.length && docSlots[slotIndex].map((item,index)=>(
          <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime ? 'bg-primary text-white' : 'text-gray-400 border border-gray-300'}`} key={index}>
            {item.time.toLowerCase()}
          </p>
        ))}
      </div>
      <button className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an appointment</button>

    </div>
    {/*----listing related doc-*/}
    <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
  </div>
)

  
}

export default Appointment 

