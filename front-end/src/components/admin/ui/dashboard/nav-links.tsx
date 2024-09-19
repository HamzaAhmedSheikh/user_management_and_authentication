'use client';

// import {
//   UserGroupIcon,
//   HomeIcon,
//   DocumentDuplicateIcon,
//   ChatBubbleLeftRightIcon,
// } from '@heroicons/react/24/outline';
import { HomeIcon, User, Wallet, BookOpen} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
  { name: 'Course Content', href: '/dashboard/course_content', icon: BookOpen },
  {
    name: 'Payments',
    href: '/dashboard/payments',
    icon: Wallet,
  },
  
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-gray-100 md:flex-none md:justify-start md:p-2 md:px-3',
              {
                'bg-gray-100': pathname === link.href,
              },
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
