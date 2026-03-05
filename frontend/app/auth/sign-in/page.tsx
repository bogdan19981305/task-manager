import { LoginForm } from "@/features/auth/login/ui/login-form";
import AuthShell from "@/widgets/auth-shell/ui/auth-shell";

export default function Page() {
  return (
    <AuthShell>
      <LoginForm />
    </AuthShell>
  );
}
