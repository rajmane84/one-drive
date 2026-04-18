"use client"
import Link from 'next/link'
import { Button } from './ui/button';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/features/auth/hooks/use-logout';

const Navbar = () => {
    const { mutate: logout, isPending } = useLogout();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className='flex items-center justify-between lg:px-12 px-6 fixed h-16 w-full z-50 bg-white/50 backdrop-blur-md'>
        <Link href="/">
            <h1 className='font-bold text-2xl font-inter tracking-tight cursor-pointer'>One Drive</h1>
        </Link>
        <div className="flex items-center gap-4">
        {isAuthenticated && (
          <Button variant="outline" onClick={() => logout()} disabled={isPending} className={"cursor-pointer"}>
            {isPending ? "Logging out..." : "Logout"}
          </Button>
        )}
      </div>
    </div>
  )
}

export default Navbar