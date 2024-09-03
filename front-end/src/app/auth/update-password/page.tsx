import React, { Suspense } from 'react'
import UpdatePassword from '@/src/components/auth/update-password'

const updatePassword = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      <Suspense>
          <UpdatePassword />
      </Suspense>
    </div>
  )
}

export default updatePassword