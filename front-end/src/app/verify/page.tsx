import EmailVerificationPending from '@/src/components/auth/pendingverification'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
        <Suspense>
            <EmailVerificationPending />
        </Suspense>
    </div>
  )
}

export default page