import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const PublicHeader = () => {
  const pathName = usePathname()
  if(pathName === ("/"))
    return
  return (
    <div className='p-5 bg-primary text-white m-1 rounded-lg flex justify-around'>
      <h2 className='text-2xl font-bold'>Wasan Pizza</h2>
      <Link href='/' className='cursor-pointer text-black' > &larr; Back To Home</Link>
      
      </div>
  )
}

export default PublicHeader