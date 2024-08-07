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
  const tokenRef = useRef(localStorage.getItem("token"));

  const navigate = useNavigate();
  const baseUrl = "http://localhost:8080";

  useEffect(() => {
    // Check if token exists in the ref
    const token = tokenRef.current;
    console.log("Token on page load:", token);
    localStorage.setItem('url',location.pathname)
    if (token) {
      verifyToken(token);
    } else {
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      console.log('Verifying token...');
      const response = await axios.post(`${baseUrl}/login/verifyToken`, { token });
     
      if (response.data.valid) {
        setIsAuthenticated(true);
        navigate(localStorage.getItem("url"));
      }
 {
        console.log("Token invalid");
        // localStorage.removeItem("token");
        tokenRef.current = null; 
      }
    } catch (error) {
      console.error("Token verification failed", error);
      localStorage.removeItem("token");
      tokenRef.current = null;
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
    console.log("Path name ", location.pathname);
    try {
      const response = await axios.post(`${baseUrl}/login/verify`, credentials);
      const { token } = response.data;
      console.log("Token received:", token);
      localStorage.setItem("token", token);
      tokenRef.current = token;
      toast.success("Logged in Successfully");
      setIsAuthenticated(true);
    } catch (error) {
      toast.error("Invalid Credentials");
      console.error("Login failed", error);
    }
  };

  const handleLogout = (e) => {
    console.log("Logout function called");
    localStorage.removeItem("token");
    tokenRef.current = null; 
    setIsAuthenticated(false);
    navigate("/");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isAuthenticated ? (
        <Body onLogout={handleLogout} />
      ) : (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
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

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <a
                href="#"
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Start a 14 day free trial
              </a>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
