import { AuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'

type Props = {
    children: React.ReactNode
}

const ProtectLoggedInRoutes = ({ children }: Props) => {
    const router = useRouter()

    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
      console.log(currentUser)
        if (currentUser?.uid) router.replace("/")
    }, [currentUser])

  return (
    <>
    {children}
    </>
  )
}

export default ProtectLoggedInRoutes