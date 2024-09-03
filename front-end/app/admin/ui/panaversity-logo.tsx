import panaverse_logo from "@/public/red-p-logo.png";
import { lusitana } from '@/app/admin/ui/fonts';
import Image from "next/image";

export default function PanaversityLogo() {
  return (
    <div
      className={`${lusitana.className} flex items-center space-x-2 text-black`}
    >
      {/* Add the Panaverse logo */}
      <Image src={panaverse_logo.src} alt="Panaversity Logo" width={60} height={60} />
      <p className="text-[20px] font-bold">Panaversity</p>
    </div>
  );
}
