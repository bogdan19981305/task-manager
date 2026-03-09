import RegisterForm from "@/features/auth/register/ui/register-form";
import AuthShell from "@/widgets/auth-shell/ui/auth-shell";

export default function Page() {
  return (
    <AuthShell>
      <RegisterForm />
    </AuthShell>
  );
}
