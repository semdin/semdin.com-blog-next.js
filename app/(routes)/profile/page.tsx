"use server";
import { SignOutButton } from "@/components/Auth/SignOutButton";
import { auth } from "@/lib/auth/authConfig";
import { getUserRole } from "@/lib/auth/getUserRoleServerAction";

export default async function ProfilePage() {
  const user_role = await getUserRole();
  const session = await auth();
  const name = session?.user?.name;
  return (
    <div className="flex items-center justify-center h-screen flex-col">
      <h1 className="text-2xl font-bold">
        {" "}
        {user_role?.role} - {name} Profile
      </h1>
      <p className="text-gray-500 mt-4">This is a profile page.</p>
      <SignOutButton />
    </div>
  );
}
