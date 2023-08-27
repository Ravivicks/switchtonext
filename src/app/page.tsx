import ThemeSwitcher from "@/theme/ThemeSwitcher";
import { options } from "./api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import UserCard from '@/components/UserCard'
import Login from "@/app/login/page";

export default async function Home() {
  const session = await getServerSession(options)
  return (
    <>
    {session ? (
        <UserCard user={session?.user} pagetype={"Home"} />
      ) : (
        <Login />
      )}
    {/* <ThemeSwitcher /> */}
    </>
  )
}
