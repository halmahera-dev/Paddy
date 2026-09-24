import { SignUpForm } from "@/features/user/components/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-bold text-2xl">Create your account</h1>
        <p className="text-balance text-muted-foreground text-sm">
          Enter your details below to create your account
        </p>
      </div>
      <SignUpForm />
    </div>
  );
}
