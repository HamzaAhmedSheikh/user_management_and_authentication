import Verify from '@/src/components/auth/verify-user'
import React, { Suspense } from 'react'

const verification = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
        <Suspense>
            <Verify />
        </Suspense>
    </div>
  )
}

export default verification