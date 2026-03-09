"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { RegisterDto, registerDtoSchema } from "../model/schema";
import { useRegister } from "../model/use-register";

const SignupForm = ({ className, ...props }: React.ComponentProps<"div">) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterDto>({
    resolver: zodResolver(registerDtoSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const { mutate: handleRegisterMutation, isPending } = useRegister();

  const handleRegister = (data: RegisterDto) => {
    handleRegisterMutation(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                />
                {errors.name && (
                  <FieldError errors={[errors.name]}>
                    {errors.name.message}
                  </FieldError>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  {...register("email")}
                />
                {errors.email && (
                  <FieldError errors={[errors.email]}>
                    {errors.email.message}
                  </FieldError>
                )}
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                    />
                    {errors.password && (
                      <FieldError errors={[errors.password]}>
                        {errors.password.message}
                      </FieldError>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="passwordConfirmation">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="passwordConfirmation"
                      type="password"
                      {...register("passwordConfirmation")}
                    />
                    {errors.passwordConfirmation && (
                      <FieldError errors={[errors.passwordConfirmation]}>
                        {errors.passwordConfirmation.message}
                      </FieldError>
                    )}
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button
                  disabled={isPending}
                  type="submit"
                  onClick={handleSubmit(handleRegister)}
                >
                  {isPending ? (
                    <Loader className="size-4 animate-spin" />
                  ) : null}
                  Create Account
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <a href="#">Sign in</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
};

export default SignupForm;
