import React from "react";
import { useLocation, useNavigate } from "react-router";
export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.pathname);
  function pathMatchRoute(route) {
    if (route === location.pathname) {
      return true;
    }
    return false;
  }
  return (
    <div className="bg-white border-b shadow-sm sticky top-0 z-50">
      <header className="flex items-center justify-between px-5 max w max-w-6xl m-auto">
        <div>
          <img
            src="https://static.rdc.moveaws.com/images/logos/rdc-logo-default.svg"
            alt="logo"
            className="h-5 cursor-pointer"
            onClick={() => navigate("/")}
          />
        </div>
        <div>
          <ul className="flex space-x-10">
            <li
              className={`cursor-pointer py-3 font-semibold text-sm text-gray-400 border-b-[3px] border-b-transparent ${
                pathMatchRoute("/") ? "text-black border-b-yellow-500" : ""
              }`}
              onClick={() => navigate("/")}
            >
              Home
            </li>
            <li
              className={`cursor-pointer py-3 font-semibold text-sm text-gray-400 border-b-[3px] border-b-transparent ${
                pathMatchRoute("/offers")
                  ? "text-black border-b-yellow-500"
                  : ""
              }`}
              onClick={() => navigate("/offers")}
            >
              Offers
            </li>
            <li
              className={`cursor-pointer py-3 font-semibold text-sm text-gray-400 border-b-[3px] border-b-transparent ${
                pathMatchRoute("/sign-in")
                  ? "text-black border-b-yellow-500"
                  : ""
              }`}
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </li>
          </ul>
        </div>
      </header>
    </div>
  );
}
