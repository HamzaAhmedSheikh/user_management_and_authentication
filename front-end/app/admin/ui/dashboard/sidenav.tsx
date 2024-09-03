import Link from 'next/link';
import NavLinks from '@/app/admin/ui/dashboard/nav-links';
import PanaversityLogo from '@/app/admin/ui/panaversity-logo';
// import { PowerIcon } from '@heroicons/react/24/outline';
import { PowerIcon } from 'lucide-react';
import { signOut } from '@/auth';

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-4 py-4 md:px-3">
      <Link
        className="mb-4 flex items-center justify-start rounded-md bg-red-100 p-4"
        href="/"
      >
        <PanaversityLogo />
      </Link>
      <div className="flex grow flex-col justify-between space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          action={async () => {
            'use server';
            await signOut();
          }}
        >
          <button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-red-100 hover:text-red-600 md:justify-start md:p-2">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
