import { SignInForm } from "@/features/user/components/sign-in-form";

export default function SignInPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-2xl">Login</h1>
        <p className="text-balance text-muted-foreground text-sm">
          Enter your email below to login to your account
        </p>
      </div>
      <SignInForm />
    </div>
  );
}
