import React, { use, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { signInUser, signInWithGoogle,token } = use(AuthContext);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    let form = e.target;
    let formdata = new FormData(form);
    let alldata = Object.fromEntries(formdata.entries());
    let { email, password } = alldata;

    signInUser(email, password).then((res) => {
      const user = res.user;
      if (user) {
        toast.success("User Login Successfully");
        navigate("/");
      }
    });
  };

  const handleSignInGoogle = () => {
    signInWithGoogle().then((res) => {
      const user = res.user;
      console.log(user);
      if (user) {
        toast.success("User Login Successfully");
        //send user data to server
        axios.post("http://localhost:3000/users", {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          role: "user",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, //send token in header
          },
        }
      );
        navigate("/");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen bg-gradient-to-tr from-green-100 via-white to-green-50 flex items-center justify-center px-4 py-12"
    >
      <div className="flex flex-col md:flex-row bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden w-full max-w-6xl">
        {/* Left Section - Illustration */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-green-100 p-8">
          <img
            src="/assets/bg.svg"
            alt="Illustration"
            className="max-w-md drop-shadow-xl"
          />
        </div>

        {/* Right Section - Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-white bg-opacity-90 backdrop-blur-lg">
          {/* Logo or App Name */}
          <div className="text-center mb-6">
            <img
              src="/assets/avatar.svg"
              alt="Logo"
              className="w-12 mx-auto mb-2"
            />
            <h2 className="text-3xl font-bold text-green-600">Welcome Back!</h2>
            <p className="text-gray-500 text-sm">
              Please login to your account
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                className="w-full px-4 py-2 border border-green-300 focus:ring-2 focus:ring-green-400 rounded-xl transition duration-200 shadow-sm focus:outline-none"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Password
              </label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-2 border border-green-300 focus:ring-2 focus:ring-green-400 rounded-xl pr-10 transition duration-200 shadow-sm focus:outline-none"
                placeholder="Enter your password"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-9 cursor-pointer text-gray-500 hover:text-green-500"
              >
                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </span>
            </div>

            {/* Forgot password */}
            <div className="text-right">
              <Link
                to="/forgotpassword"
                className="text-sm text-green-600 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-base font-semibold shadow-md transition duration-200"
            >
              Login
            </button>

            {/* Register Prompt */}
            <p className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-green-600 font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </form>

          {/* Divider */}
          <div className="divider my-6">OR</div>

          {/* Google Login */}
          <button
            onClick={handleSignInGoogle}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded-full hover:bg-gray-100 transition duration-150"
          >
            <svg
              aria-label="Google logo"
              width="16"
              height="16"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <g>
                <path d="m0 0H512V512H0" fill="#fff"></path>
                <path
                  fill="#34a853"
                  d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                ></path>
                <path
                  fill="#4285f4"
                  d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                ></path>
                <path
                  fill="#fbbc02"
                  d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                ></path>
                <path
                  fill="#ea4335"
                  d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                ></path>
              </g>
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Continue with Google
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
