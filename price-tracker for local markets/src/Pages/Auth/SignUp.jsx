import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import registerlottie from "../../assets/looties/register.json";
import Lottie from "lottie-react";
import { AuthContext } from "../../context/AuthContext";
import Swal from "sweetalert2";
import axios from "axios";
import { toast } from "react-toastify";
const SignUp = () => {
  const [error, setError] = useState("");
  const { createUser, profile, setUser, user, signInWithGoogle, token } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    let form = e.target;
    let formdata = new FormData(form);
    let alldata = Object.fromEntries(formdata.entries());
    let { email, password, name, photo } = alldata;
    let passtest = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/;
    if (passtest.test(password) === false) {
      setError(
        "Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, Length must be 6 characters"
      );
      return;
    }
    createUser(email, password).then((res) => {
      const users = res.user;
      if (users) {
        toast.success("User Login Successfully");
      }
      navigate("/");

      //  console.log(user);
      // Update user profile with name and photo
      profile({
        displayName: name,
        photoURL: photo,
      });
      setUser({ ...user, displayName: name, photoURL: photo });
      setError("");
      // Optionally redirect or show success message here
    });
    //send user data to server
    axios
      .post(
        "http://localhost:3000/users",
        {
          name,
          email,
          photo,
          role: "user",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .catch((err) => {
        setError(err.message || "Registration failed");
      });
  };

  const handleSignInGoogle = () => {
    signInWithGoogle()
      .then((res) => {
        const user = res.user;
        if (user) {
          Swal.fire({
            title: "Google Sign In Successful",
            icon: "success",
            draggable: true,
            timer: 800,
            showConfirmButton: false,
            background: "#e6f9ed",
            color: "#166534",
            iconColor: "#22c55e",
            customClass: {
              popup: "rounded-xl shadow-lg",
              title: "font-bold text-lg",
              content: "text-base",
            },
          });

          //send user data to server
          axios.post(
            "http://localhost:3000/users",
            {
              name: user.displayName,
              email: user.email,
              photo: user.photoURL,
              role: "user",
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          navigate("/");
        }
      })

      .catch((err) => {
        setError(err.message || "Google Sign Up failed");
      });
  };

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-around shadow-2xl bg-gradient-to-tr from-green-100 via-white to-green-50 p-4 md:p-8">
      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white w-full md:w-1/2 max-w-md p-8 rounded-3xl z-10"
      >
        <h2 className="text-2xl md:text-3xl font-extrabold text-center text-green-600 mb-6 inter">
          Register Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 inter">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              required
              className="input input-bordered w-full border-green-400 focus:border-green-600 rounded-xl"
              placeholder="Enter your name"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL
            </label>
            <input
              type="text"
              name="photo"
              required
              className="input input-bordered w-full border-green-400 focus:border-green-600 rounded-xl"
              placeholder="Paste profile photo URL"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="input input-bordered w-full border-green-400 focus:border-green-600 rounded-xl"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="input input-bordered w-full border-green-400 focus:border-green-600 rounded-xl"
              placeholder="Enter your password"
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-2xl transition duration-200"
          >
            Register
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </form>

        <div className="divider my-6">OR</div>

        {/* Google Sign Up */}
        <button
          onClick={handleSignInGoogle}
          className="btn w-full bg-white text-black border border-gray-300 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2 transition"
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
          </svg>{" "}
          Sign up with Google
        </button>
      </motion.div>

      {/* Lottie Animation */}
      <div className="w-40 md:w-1/2 mt-8 md:mt-0 md:mb-14 flex items-center justify-center">
        <Lottie
          animationData={registerlottie}
          loop={true}
          className="max-w-[550px] w-full"
        />
      </div>
    </div>
  );
};

export default SignUp;
