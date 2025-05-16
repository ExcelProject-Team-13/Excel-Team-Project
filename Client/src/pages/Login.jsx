import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Divider, Input, PasswordInput, Text } from "@mantine/core";
import { AtSign, ChartBarStacked, Lock } from "lucide-react";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { notifications } from "@mantine/notifications";
import axios from "axios";

import AuthImagePattern from "../components/AuthImagePattern";


const LoginPage = () => {
  const initialValues = {
    username: "",
    password: ""
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmitting(true);
  };

  useEffect(() => {
    const submitData = async () => {
      try {
        const response = await axios.post("https://your-backend-url.com/api/login", formValues);
        console.log("Server response:", response.data);

        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          console.log("Server response:", response.data);

          localStorage.setItem('role', response.data.user.role);

          notifications.show({
            title: "Success",
            message: "Login successful! Welcome back.",
            color: "green",
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
        }

      } catch (error) {
        notifications.show({
          title: "Error",
          message: error.response?.data?.message || "Login failed. Please check your credentials.",
          color: "red",
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
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/; // At least 8 characters, 1 uppercase, 1 number
    if (!values.username) {
      errors.username = "Username is required";
    }
    if (!values.password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(values.password)) {
      errors.password = "Password must be at least 8 characters, with 1 uppercase and 1 number";
    }
    return errors;
  };

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

          const role = localStorage.getItem('role')
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
        <div className="w-full max-w-md space-y-8">
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="bg-[#e6f0ed] p-2 rounded-lg">
                <ChartBarStacked size={28} color="#0f4736" />
              </div>
              <h1 className="text-2xl font-bold mt-2">Welcome Back</h1>
              <p className="text-base-content/60">Sign in to your account</p>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              Sign in
            </Button>

            <Divider label="Or continue with Google" labelPosition="center" my="sm" />

            {/* Custom Google login button */}
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
          </form>

          <div className="text-center mt-6">
            <p>
              Already have an account?{" "}
              <Link to="/signup" className="text-[#0f4736] font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Welcome Back to Insight"
        subtitle="Access your Excel analytics, visualize trends, and continue making data-driven decisions."
      />
    </div>
  );
};

const WrappedSigninPage = () => (
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <LoginPage />
  </GoogleOAuthProvider>
);

export default WrappedSigninPage;
