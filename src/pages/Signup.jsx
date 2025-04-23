import { Link } from "react-router-dom"
import { Button, Input, PasswordInput, Text } from "@mantine/core"
import {
  User,
  AtSign,
  Mail,
  Lock
} from "lucide-react"
import AuthImagePattern from "../components/AuthImagePattern"

const SignUpPage = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input.Wrapper label="First Name" required>
                <Input placeholder="John" leftSection={<User size={16} />} />
              </Input.Wrapper>
              <Input.Wrapper label="Last Name" required>
                <Input placeholder="Doe" leftSection={<User size={16} />} />
              </Input.Wrapper>
            </div>
            <Input.Wrapper label="Username" required>
              <Input placeholder="@johndoe" leftSection={<AtSign size={16} />} />
            </Input.Wrapper>
            <Input.Wrapper label="Email" required>
              <Input
                placeholder="you@example.com"
                leftSection={<Mail size={16} />}
              />
            </Input.Wrapper>
            <Input.Wrapper label="Password" required>
              <PasswordInput
                placeholder="••••••••"
                leftSection={<Lock size={16} />}
              />
              <Text size="xs" c="dimmed" mt={4}>
                Must be at least 8 characters with 1 uppercase, 1 number
              </Text>
            </Input.Wrapper>
            <Button fullWidth>
              Create Account
            </Button>
          </form>

          <div className="text-center mt-6">
            <p>
              Already have an account?{" "}
              <Link to="/login" className="text-[#0f4736] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  )
}

export default SignUpPage
