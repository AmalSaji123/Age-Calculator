import React , {useState} from 'react'

function AgeCalculator() {

    const [age,setAge] = useState(null)
    const [birthdate,setBirthdate] = useState(null)

    const CalculateAge=()=>{
        let Year = new Date().getFullYear() - new Date(birthdate).getFullYear()
        const Month = Math.abs(new Date().getMonth() - new Date(birthdate).getMonth())
        const Day = new Date().getDate()
        console.log(Year,Month,Day)

        if(new Date(birthdate).getMonth() >= new Date().getMonth() && new Date(birthdate).getDate() >= new Date().getDate())
        {
            setAge(Year)
        }
        else{
            setAge(Year-1)
        }
        
    }

    const ResetAge=()=>{
        setAge(null)
        setBirthdate('')
    }

  return (
    <div className='flex justify-center min-h-screen bg-gray-500 p-20'>
        
        <div className='mt-10 p-10 bg-amber-50 rounded-2xl mb-16'>
            <h1 className='flex justify-center text-2xl font-extrabold'>Age Calculator</h1>
            <input className='w-2xs mt-7'
            value={birthdate}
            onChange={(e)=>{
                setBirthdate(e.target.value)
            }}
            type='date'
            />
        
        <p className='space-x-2'>
            <button className='cursor-pointer bg-emerald-300 mt-4 p-2' onClick={CalculateAge}>Calculate Age</button>
            <button className='cursor-pointer bg-emerald-300 mt-4 p-2' onClick={ResetAge}>Reset</button>
            
        </p>
        <p className='p-10 cursor-pointer mt-4 text-2xl font-bold'>Age : {age}</p>
        </div>
    </div>
  )
}

export default AgeCalculator
