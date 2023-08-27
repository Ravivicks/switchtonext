'use client'

import React from 'react'
import { options } from "./api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import UserCard from '@/components/UserCard'
import { useRouter } from "next/navigation";

export default async function Main() {
    const router = useRouter()
  const session = await getServerSession(options)
  return (
    <>
    {session ? (
        <UserCard user={session?.user} pagetype={"Home"} />
      ) : (
        router.push('/api/auth/signin')
      )}
    </>
  )
}
