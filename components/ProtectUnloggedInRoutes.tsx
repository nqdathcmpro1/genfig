import { AuthContext } from '@/context/AuthContext'
import { useRouter } from 'next/router'
import React, { useContext, useEffect } from 'react'

type Props = {
    children: React.ReactNode
}

const ProtectUnloggedInRoutes = ({ children }: Props) => {
    const router = useRouter()

    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (!currentUser?.uid) router.replace("/auth/login")
    }, [])

  return (
    <>
    {children}
    </>
  )
}

export default ProtectUnloggedInRoutes