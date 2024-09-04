import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/panaverse_transparent_small.png";
import { lusitana } from "./ui/fonts";

export default function Page() {
  return (
    <main className="flex flex-col min-h-screen">
      <div className="flex items-end">
        <Image src={Logo} alt="Logo" height={100} />
      </div>
      <div className="flex flex-grow">
        <div className="flex flex-col justify-center items-center w-full">
          <div className="flex flex-col justify-center w-full max-w-md mx-auto gap-6 rounded-lg bg-gray-200 px-6 py-10 md:px-14">
            <p
              className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}
            >
              <strong>Welcome to Admin Panel.</strong> Click Below To Login As
              An Admin
            </p>
            <Link
              href="/admin/login"
              className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
            >
              <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
