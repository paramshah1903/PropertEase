import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;
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
        <h1 className="text-3xl text-center mt-6 font-bold">SignIn</h1>
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
                type="email"
                id="email"
                value={email}
                onChange={onChange}
                className="text-2xl mb-6 w-full px-4 py-2 text-gray-700 bg-white border-red-500 rounded transition ease-in-out"
                placeholder="Email Address"
              ></input>
              <div className="relative mb-6">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={onChange}
                  className="text-2xl w-full px-4 py-2 text-gray-700 bg-white border-red-500 rounded transition ease-in-out"
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
                  Don't have and account?
                  <Link
                    to="/sign-up"
                    className="text-red-600 hover:text-red-300 transition duration-200 ease-in-out"
                  >
                    Register
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
                Sign In
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
//mt-6 for margin top 6 i.e 24px
//md:w-[67%] lg:w-[50%] mb-12 lg:mb-6:-md:w-[67%]: On medium (md) screens and larger, the width of the element will be 67% of its parent container. This is a custom width utility provided by Tailwind CSS's Just-in-Time (JIT) mode.
// lg:w-[50%]: On large (lg) screens and larger, the width of the element will be 50% of its parent container. This overrides the md:w-[67%] class on large screens.
// mb-12: This sets the bottom margin (mb) of the element to 3rem (where 1rem = 16px in most browsers, so 12 * 0.25rem = 3rem). This is applied at all screen sizes, unless overridden by a responsive variant.
// lg:mb-6: On large (lg) screens and larger, the bottom margin of the element will be 1.5rem (6 * 0.25rem = 1.5rem). This overrides the mb-12 class on large screens.
//the w-full class is added to make it occupy the full width of its parent container

//to make it responsive..inside the input we add a class lg:ml-20 which means that only if screen is large we want
//a margin-left of 5rem

//npm install -D @tailwindcss/forms then add it as a plugin in the tailwind.css config file to add some predefined styling to a form

//to enable the functionality of show and hide password we installed react-icons package and used state management to enable the
//show and hide eye button along with changing it type from text to password to effectively show and hide password as required

//before and after pseudo classes used for the OR section above the sign in button
//items-center my-4 flex before:border-t before:flex-1 before:border-black after:border-t after:flex-1 after:border-black
