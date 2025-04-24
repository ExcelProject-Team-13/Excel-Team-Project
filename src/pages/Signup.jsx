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
            <Link to="/"><svg id="logo-15" width="35px" height="35px" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M24.5 12.75C24.5 18.9632 19.4632 24 13.25 24H2V12.75C2 6.53679 7.03679 1.5 13.25 1.5C19.4632 1.5 24.5 6.53679 24.5 12.75Z" className="ccustom" fill="#126a4e"></path> <path d="M24.5 35.25C24.5 29.0368 29.5368 24 35.75 24H47V35.25C47 41.4632 41.9632 46.5 35.75 46.5C29.5368 46.5 24.5 41.4632 24.5 35.25Z" className="ccustom" fill="#126a4e"></path> <path d="M2 35.25C2 41.4632 7.03679 46.5 13.25 46.5H24.5V35.25C24.5 29.0368 19.4632 24 13.25 24C7.03679 24 2 29.0368 2 35.25Z" className="ccustom" fill="#0f4736"></path> <path d="M47 12.75C47 6.53679 41.9632 1.5 35.75 1.5H24.5V12.75C24.5 18.9632 29.5368 24 35.75 24C41.9632 24 47 18.9632 47 12.75Z" className="ccustom" fill="#0f4736"></path> </svg></Link>
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
              <Link to="/" className="text-[#0f4736] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Start Exploring Your Data"
        subtitle="Create your account to analyze data, build dashboards, and discover smarter Excel insights."
      />
    </div>
  )
}

export default SignUpPage
