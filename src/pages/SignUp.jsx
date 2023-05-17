import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { name, email, password } = formData;
  function onChange(e) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  }
  //the square brackets are used to dynamically assign the name of an object property
  return (
    <diV>
      <section>
        <h1 className="text-3xl text-center mt-6 font-bold">SignUp</h1>
        <div className="flex justify-center flex-wrap items-center px-4 py-4 max-w-6xl mx-auto">
          <div className="md:w-[67%] lg:w-[50%] mb-12 lg:mb-6 ">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8a2V5c3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
              alt="keys"
              className="w-full rounded-2xl"
            />
          </div>
          <div className="w-full md:w-[67%] lg:w-[40%] lg:ml-20">
            <form>
              <input
                type="text"
                id="name"
                value={name}
                onChange={onChange}
                className="text-xl mb-6 w-full px-4 py-2 text-gray-700 bg-white border-red-500 rounded transition ease-in-out"
                placeholder="Full Name"
              ></input>
              <input
                type="email"
                id="email"
                value={email}
                onChange={onChange}
                className="text-xl mb-6 w-full px-4 py-2 text-gray-700 bg-white border-red-500 rounded transition ease-in-out"
                placeholder="Email Address"
              ></input>
              <div className="relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={onChange}
                  className="text-xl w-full px-4 py-2 text-gray-700 bg-white border-red-500 rounded transition ease-in-out"
                  placeholder="Password"
                ></input>
                {showPassword ? (
                  <AiFillEyeInvisible
                    className="absolute top-3 right-3 text-xl cursor-pointer"
                    onClick={() => {
                      setShowPassword((prevState) => !prevState);
                    }}
                  />
                ) : (
                  <AiFillEye
                    className="absolute top-3 right-3 text-xl cursor-pointer"
                    onClick={() => {
                      setShowPassword((prevState) => !prevState);
                    }}
                  />
                )}
              </div>
              <div className="flex justify-between whitespace-nowrap text-sm sm:text-lg mb-6">
                {/* //the whitespace-nowrap is used to In Tailwind CSS, the
                whitespace-nowrap class prevents text from wrapping within an
                element. Newlines and spaces will be collapsed. */}
                <p>
                  Have an account?
                  <Link
                    to="/sign-in"
                    className="text-red-600 hover:text-red-300 transition duration-200 ease-in-out"
                  >
                    SignIn
                  </Link>
                </p>
                <Link
                  to="/forgot-password"
                  className="text-blue-600 hover:text-blue-300 transition duration-200 ease-in-out"
                >
                  Forgot Password
                </Link>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 px-5 py-3 uppercase rounded text-white text-sm shadow-md hover:shadow-lg hover:bg-blue-700 transition duration-150 ease-in-out "
              >
                Sign Up
              </button>
              <div>
                <p className="text-center font-bold items-center my-4 flex before:border-t before:flex-1 before:border-black after:border-t after:flex-1 after:border-black">
                  OR
                </p>
                <OAuth />
              </div>
            </form>
          </div>
        </div>
      </section>
    </diV>
  );
}
