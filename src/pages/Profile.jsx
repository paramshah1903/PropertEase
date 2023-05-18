import { getAuth } from "firebase/auth";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email,
  });

  const { name, email } = formData;

  function onLogout() {
    auth.signOut();
    navigate("/");
  }

  return (
    <>
      <section className="flex items-center justify-center flex-col">
        <h1 className="text-3xl font-bold text-center mt-6">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6">
          <form>
            <input
              type="text"
              id="name"
              value={name}
              disabled
              className="w-full text-xl text-gray-700 mb-6 bg-white rounded transition ease-in-out"
            ></input>

            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full text-xl text-gray-700 mb-6 bg-white rounded transition ease-in-out"
            ></input>

            <div className="flex justify-between text-[18px] whitespace-nowrap mb-6">
              <p>
                Do you want to change your details?{" "}
                <span className="text-red-500 cursor-pointer hover:text-red-800 transition duration-150 ease-in-out">
                  Edit
                </span>
              </p>
              <p
                className="text-blue-500 cursor-pointer hover:text-blue-800 transition duration-150 ease-in-out"
                onClick={onLogout}
              >
                Sign Out
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
