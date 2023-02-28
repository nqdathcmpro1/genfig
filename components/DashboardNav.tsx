import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

type Props = {}

const DashboardNav = (props: Props) => {
    const router= useRouter()

    console.log(router.pathname)

  return (
    <div className='sticky top-0 w-full h-[100px] flex items-center justify-center bg-cyan-100 gap-10'>
        <Link className={`${router.pathname === "/dashboard" && "font-bold"}`} href="/dashboard">Giao dịch</Link>
        <Link className={`${router.pathname === "/dashboard/category" && "font-bold"}`} href="/dashboard/category">Danh mục</Link>
        <Link className={`${router.pathname === "/dashboard/product" && "font-bold"}`} href="/dashboard/product">Sản phẩm</Link>
    </div>
  )
}

export default DashboardNav