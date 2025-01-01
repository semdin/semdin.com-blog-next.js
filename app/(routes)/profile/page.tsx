"use server";

import Image from "next/image";
import { SignOutButton } from "@/components/Auth/SignOutButton";
import { auth } from "@/lib/auth/authConfig";
import { getUserRole } from "@/lib/auth/getUserRoleServerAction";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ProfilePage() {
  const user_role = await getUserRole();
  const session = await auth();
  const name = session?.user?.name;
  const profile_image = session?.user?.image;

  return (
    <div className="flex h-screen items-center justify-center">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="flex flex-col items-center">
          <div className="relative w-32 h-32 mb-4">
            {profile_image ? (
              <Image
                src={profile_image}
                alt={`${name}'s profile`}
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-4xl text-gray-600">
                  {name?.[0]?.toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            {name}
          </CardTitle>
          <CardDescription className="text-center text-gray-500">
            {user_role?.role}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">Welcome to your profile page!</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <SignOutButton />
        </CardFooter>
      </Card>
    </div>
  );
}
