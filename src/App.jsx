import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Body from "./components/Body";
import InfiniaLogo from "../src/assets/InfiniaLogo.png";

export default function App() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use useRef to keep the token across renders
  const tokenRef = useRef(sessionStorage.getItem("token"));
  const navigate = useNavigate();
  const baseUrl = "http://localhost:8080";
  // const baseUrl = "https://infinia-kappa.vercel.app";

  useEffect(() => {
    // Check if the session has an existing token
    const token = tokenRef.current;
    const isUserAuthenticated = localStorage.getItem("isAuthenticated");
    console.log("Token on page load:", token);

    if (token && isUserAuthenticated) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  // email:admin@gmail.com
  // password:12345

  const verifyToken = async (token) => {
    try {
      console.log("Verifying token...");
      const response = await axios.post(`${baseUrl}/login/verifyToken`, {
        token,
      });

      if (response.data.valid) {
        setIsAuthenticated(true);
        navigate(localStorage.getItem("url") || "/dashboard");
      } else {
        console.log("Token invalid");
        sessionStorage.removeItem("token");
        tokenRef.current = null;
        setIsAuthenticated(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Token verification failed", error);
      sessionStorage.removeItem("token");
      tokenRef.current = null;
      setIsAuthenticated(false);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleVerify = async (event) => {
    event.preventDefault();
    try {
      console.log("login function call", `${baseUrl}/login/verify`);
      const response = await axios.post(`${baseUrl}/login/verify`, credentials);
      const { token } = response.data;
      console.log("Token received:", token);
      sessionStorage.setItem("token", token); 
      tokenRef.current = token;
      localStorage.setItem("isAuthenticated", true); 
      toast.success("Logged in Successfully");
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid Credentials");
      console.log('Error ',error)
      console.error("Login failed", error);
    }
  };

  const handleLogout = (e) => {
    console.log("Logout function called");
    sessionStorage.removeItem("token");
    tokenRef.current = null;
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated"); // Remove the flag on logout
    navigate("/");
  };

  if (isLoading) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="w-12 h-12 animate-spin"
        viewBox="0 0 16 16"
      >
        <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z" />
        <path
          fillRule="evenodd"
          d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"
        />
      </svg>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Body onLogout={handleLogout} />
      ) : (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="w-[249px] ml-[500px]">
            <img src={InfiniaLogo} alt="Infinia Logo" />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email Address
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    value={credentials.email}
                    type="email"
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleChange}
                    value={credentials.password}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>

            {/* <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <a
                href="#"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Start a 14 day free trial
              </a>
            </p> */}
          </div>
        </div>
      )}
    </>
  );
}
