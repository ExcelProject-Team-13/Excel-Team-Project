import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Button, Divider, Input, PasswordInput, Text } from "@mantine/core"
import { notifications } from "@mantine/notifications";
import {
  User,
  AtSign,
  Mail,
  Lock,
  ChartBarStacked
} from "lucide-react"
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import axios from "axios";


import AuthImagePattern from "../components/AuthImagePattern"

const SignUpPage = () => {

  const initialValues = {
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: ""
  }
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues({
      ...formValues,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmitting(true);
  };

  useEffect(() => {
    const submitData = async () => {
      try {
        const response = await axios.post("https://your-backend-url.com/api/signup", formValues);
        console.log("Server response:", response.data);

        notifications.show({
          title: 'Success',
          message: 'Account created successfully! Please login.',
          color: 'green',
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } catch (error) {
        notifications.show({
          title: 'Error',
          message: error.response?.data?.message || 'Something went wrong. Please try again.',
          color: 'red',
          autoClose: 5000,
        });
        console.error("Failed to submit form:", error);
      }
    };

    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      submitData();
    }
  }, [formErrors, isSubmitting]);

  const validate = (values) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // At least 8 characters, 1 uppercase, 1 number
    if (!values.firstName) {
      errors.firstName = "First name is required";
    }
    if (!values.lastName) {
      errors.lastName = "Last name is required";
    }
    if (!values.username) {
      errors.username = "Username is required";
    }
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(values.email)) {
      errors.email = "Invalid email format";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(values.password)) {
      errors.password = "Password must be at least 8 characters, with 1 uppercase and 1 number";
    }
    return errors;
  }


  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log("Google login success", tokenResponse);

      try {
        const res = await axios.post('https://your-backend-url.com/api/oauth/google', {
          access_token: tokenResponse.access_token,
        });

        localStorage.setItem('token', res.data.token);
        console.log("Server response:", res.data);

        localStorage.setItem('role', res.data.user.role);

        notifications.show({
          title: 'Success',
          message: 'Logged in with Google successfully!',
          color: 'green',
          autoClose: 3000,
        });

        setTimeout(() => {

          const role = localStorage.getItem('role');
          if (role === "admin") {
            navigate('/admin');
          } else {
            navigate('/user')
          }
        }, 2000);

      } catch (error) {
        console.error("Google OAuth failed", error);
        notifications.show({
          title: 'Error',
          message: error.response?.data?.message || 'Google login failed!',
          color: 'red',
          autoClose: 5000,
        });
      }
    },
    onError: (error) => {
      console.error("Google login error", error);
      notifications.show({
        title: 'Error',
        message: 'Google login failed!',
        color: 'red',
        autoClose: 5000,
      });
    },
    flow: "implicit",
    popup_type: "token",
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-md space-y-4">
          {/* LOGO */}
          <div className="text-center mb-5">
            <div className="flex flex-col items-center gap-2 group">
              <div className="bg-[#e6f0ed] p-2 rounded-lg">
                <ChartBarStacked size={28} color="#0f4736" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Create Account</h1>
              <p className="text-base-content/60">Get started with your free account</p>
            </div>
          </div>

          {/* Social login buttons */}
          <Button
            fullWidth
            variant="default"
            className="flex items-center justify-center bg-white border hover:bg-gray-100 text-black"
            onClick={() => login()}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </Button>


          <Divider label="Or continue with email" labelPosition="center" my="sm" />

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <Input.Wrapper label="First Name" required>
                <Input
                  type="text"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  leftSection={<User size={16} />} />
                <p className="text-red-600">{formErrors.firstName}</p>
              </Input.Wrapper>
              <Input.Wrapper label="Last Name" required>
                <Input
                  type="text"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  leftSection={<User size={16} />}
                />
                <p className="text-red-600">{formErrors.lastName}</p>
              </Input.Wrapper>
            </div>
            <Input.Wrapper label="Username" required>
              <Input
                type="text"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                placeholder="@johndoe"
                leftSection={<AtSign size={16} />}
              />
              <p className="text-red-600">{formErrors.username}</p>
            </Input.Wrapper>
            <Input.Wrapper label="Email" required>
              <Input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                placeholder="you@example.com"
                leftSection={<Mail size={16} />}
              />
              <p className="text-red-600">{formErrors.email}</p>
            </Input.Wrapper>
            <Input.Wrapper label="Password" required>
              <PasswordInput
                type="password"
                name="password"
                value={formValues.password}
                onChange={handleChange}
                placeholder="••••••••"
                leftSection={<Lock size={16} />}
              />
              <p className="text-red-600">{formErrors.password}</p>
              <Text size="xs" c="dimmed" mt={4}>
                Must be at least 8 characters with 1 uppercase, 1 number
              </Text>
            </Input.Wrapper>
            <Button type="submit" fullWidth>
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

const WrappedSignUpPage = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <SignUpPage />
  </GoogleOAuthProvider>
);

export default WrappedSignUpPage;
