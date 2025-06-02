import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Checkbox,
  Link,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../../contexts/auth-context";

export const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = React.useState("admin@pos.com");
  const [password, setPassword] = React.useState("password");
  const [rememberMe, setRememberMe] = React.useState(true);
  const [error, setError] = React.useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);
    if (!success) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-content2 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center gap-2 pb-0">
            <div className="flex items-center gap-2">
              <Icon
                icon="lucide:shopping-bag"
                className="text-primary text-3xl"
              />
              <h1 className="text-2xl font-bold">businessPOS</h1>
            </div>
            <p className="text-default-500 text-center">
              Sign in to your account to continue
            </p>
          </CardHeader>
          <CardBody className="pt-6">
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              {error && (
                <div className="bg-danger-50 border border-danger-200 text-danger-700 px-3 py-2 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="text-xs text-default-500 bg-default-100 p-2 rounded">
                <strong>Demo Credentials:</strong>
                <br />
                Admin: admin@pos.com / password
                <br />
                Manager: manager@pos.com / password
                <br />
                Cashier: cashier@pos.com / password
              </div>

              <Input
                label="Email"
                placeholder="Enter your email"
                type="email"
                value={email}
                onValueChange={setEmail}
                startContent={
                  <Icon icon="lucide:mail" className="text-default-400" />
                }
                isRequired
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                type="password"
                value={password}
                onValueChange={setPassword}
                startContent={
                  <Icon icon="lucide:lock" className="text-default-400" />
                }
                isRequired
              />

              <div className="flex justify-between items-center">
                <Checkbox isSelected={rememberMe} onValueChange={setRememberMe}>
                  Remember me
                </Checkbox>
                <Link href="#" size="sm" className="text-primary">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                color="primary"
                className="mt-2"
                fullWidth
                isLoading={isLoading}
              >
                Sign In
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-default-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-content1 px-2 text-default-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="bordered"
                  startContent={<Icon icon="logos:google-icon" />}
                >
                  Google
                </Button>
                <Button
                  variant="bordered"
                  startContent={<Icon icon="logos:microsoft-icon" />}
                >
                  Microsoft
                </Button>
              </div>

              <p className="text-center text-default-500 text-sm mt-4">
                Don't have an account?{" "}
                <Link href="#" className="text-primary">
                  Sign up
                </Link>
              </p>
            </form>
          </CardBody>
        </Card>

        <p className="text-center text-default-500 text-xs mt-4">
          © 2024 businessPOS. All rights reserved.
        </p>
      </div>
    </div>
  );
};
