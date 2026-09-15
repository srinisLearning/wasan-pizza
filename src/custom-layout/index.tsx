'use client'
import { usePathname } from 'next/navigation'
import React from 'react'
import PublicHeader from './public-header'
import PrivateLayout from './private-layout'

const CustomLayout = ({children}: {children: React.ReactNode}) => {

    const pathName = usePathname()

    const isPrivateRoute = pathName.startsWith('/admin') || pathName.startsWith('/customer')
    if(!isPrivateRoute){
        return(
            <>
            <PublicHeader />
            {children}
            </>
        )
    }

  return (
    <PrivateLayout>
        {children}
    </PrivateLayout>
  )
}

export default CustomLayout