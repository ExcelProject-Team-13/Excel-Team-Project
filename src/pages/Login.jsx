import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Divider, Input, PasswordInput, Text } from "@mantine/core";
import { AtSign, Lock } from "lucide-react";
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';

import AuthImagePattern from "../components/AuthImagePattern";

const LoginPage = () => {
  const initialValues = {
    username: "",
    password: ""
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (Object.keys(formErrors).length === 0 && isSubmitting) {
      console.log("Form submitted successfully", formValues);
    }
  }, [formErrors]);

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
    onSuccess: tokenResponse => {
      console.log("Login successful", tokenResponse);
    },
    onError: err => console.error("Google login failed", err),
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
                <svg id="logo-15" width="35px" height="35px" viewBox="0 0 49 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24.5 12.75C24.5 18.9632 19.4632 24 13.25 24H2V12.75C2 6.53679 7.03679 1.5 13.25 1.5C19.4632 1.5 24.5 6.53679 24.5 12.75Z" className="ccustom" fill="#126a4e" />
                  <path d="M24.5 35.25C24.5 29.0368 29.5368 24 35.75 24H47V35.25C47 41.4632 41.9632 46.5 35.75 46.5C29.5368 46.5 24.5 41.4632 24.5 35.25Z" className="ccustom" fill="#126a4e" />
                  <path d="M2 35.25C2 41.4632 7.03679 46.5 13.25 46.5H24.5V35.25C24.5 29.0368 19.4632 24 13.25 24C7.03679 24 2 29.0368 2 35.25Z" className="ccustom" fill="#0f4736" />
                  <path d="M47 12.75C47 6.53679 41.9632 1.5 35.75 1.5H24.5V12.75C24.5 18.9632 29.5368 24 35.75 24C41.9632 24 47 18.9632 47 12.75Z" className="ccustom" fill="#0f4736" />
                </svg>
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
  <GoogleOAuthProvider clientId="1063070336560-n7g5lnsd87kf300ptcudug2il6g8ev00.apps.googleusercontent.com">
    <LoginPage />
  </GoogleOAuthProvider>
);

export default WrappedSigninPage;
