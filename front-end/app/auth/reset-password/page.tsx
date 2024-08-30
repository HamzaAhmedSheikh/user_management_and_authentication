import React, { Suspense } from 'react'
import ResetPassword from '@/components/auth/reset-password'

const resetPassword = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Suspense>
          <ResetPassword />
      </Suspense>
    </div>
  )
}

export default resetPassword