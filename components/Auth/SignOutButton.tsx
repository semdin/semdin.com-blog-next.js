import { handleSignOut } from "@/lib/auth/signOutServerAction";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await handleSignOut();
      }}
    >
      <Button type="submit">Sign out</Button>
    </form>
  );
}
