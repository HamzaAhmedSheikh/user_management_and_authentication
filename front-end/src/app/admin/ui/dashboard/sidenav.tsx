import Link from 'next/link';
import NavLinks from '@/src/app/admin/ui/dashboard/nav-links';
import PanaversityLogo from '@/src/app/admin/ui/panaversity-logo';
// import { PowerIcon } from '@heroicons/react/24/outline';
import { PowerIcon } from 'lucide-react';

import { logout } from "@/src/actions/logout";

export default function SideNav() {
  return (
    <div className="flex h-full flex-col px-4 py-4 md:px-3">
      <Link
        className="mb-4 flex items-center justify-start rounded-md"
        href="/"
      >
        <PanaversityLogo />
      </Link>
      <div className="flex grow flex-col justify-between space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <form
          // action={async () => {
          //   'use server';
          //   await signOut();
          // }}
        >
          <button className="flex h-[48px] w-full items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100 md:justify-start md:p-2"
                  onClick={async () => {
                    'use server';
                    await logout();  // Call logout on button click
                  }}
          >
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </button>
        </form>
      </div>
    </div>
  );
}
