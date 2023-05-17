import React from "react";
import { FcGoogle } from "react-icons/fc";

export default function () {
  return (
    <div>
      <button className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm shadow-md hover:shadow-lg transition duration-150 ease-in-out hover:bg-red-900 ">
        <FcGoogle className="mr-1 text-2xl bg-white rounded-full" />
        Continue with Google
      </button>
    </div>
  );
}
