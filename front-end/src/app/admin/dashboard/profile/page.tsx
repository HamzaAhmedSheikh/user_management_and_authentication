import { lusitana } from "@/src/app/admin/ui/fonts";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default function Page() {
  const profileOwner = {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Full Stack Developer with a passion for building scalable web applications and working with modern technologies.",
    location: "San Francisco, CA",
    joinDate: "January 15, 2021",
    recentActivities: [
      "Updated profile picture",
      "Completed the 'React for Beginners' course",
      "Started a new project: E-commerce Platform",
      "Contributed to Open Source",
    ],
    skills: ["JavaScript", "React", "Node.js", "Express", "MongoDB"],
  };

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${lusitana.className} mb-8 text-2xl`}>Profile</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-4">
          <div className="space-y-4">
            <h2 className=" text-gray-800">Name: {profileOwner.name}</h2>
            <p className="text-gray-800">Email: {profileOwner.email}</p>
            <p className="text-gray-800">Address: {profileOwner.location}</p>
            <p className="text-gray-800">Bio: {profileOwner.bio}</p>
            <p className="text-gray-800">
              Member since: {profileOwner.joinDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
