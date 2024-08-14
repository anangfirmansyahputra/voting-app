import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-primary to-orange-400">
      <SignIn />
    </div>
  );
}
