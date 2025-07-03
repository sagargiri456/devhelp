// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth hook

const Home = () => {
  const { user } = useAuth(); // Destructure user from AuthContext

  // Determine the correct path based on user role
  const getStartedPath = () => {
    if (!user) {
      // If user is not logged in, direct to sign in (or sign up)
      return "/signin"; // Or "/signup" if you prefer
    } else if (user.role === "student") {
      return "/doubts";
    } else if (user.role === "mentor") {
      return "/mentor";
    }
    return "/"; // Fallback, though ideally all roles are covered
  };

  return (
    <div className="relative min-h-screen w-screen overflow-hidden font-inter text-white">
      {/* Background - Remove this div if you want the global body background from index.css to show */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0C38] via-[#2A0F5B] to-[#3A127E] opacity-90" />

      {/* Main Content excluding Navbar */}
      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="flex flex-1 flex-col items-center justify-center px-4 py-12 text-center md:py-20 lg:py-24">
          <h1 className="mb-4 text-3xl font-semibold text-[#E9EDFA] sm:text-4xl md:text-5xl lg:text-6xl">
            Resolve Your Coding
            <br className="sm:hidden" /> Doubts Effortlessly
          </h1>
          <p className="mb-8 max-w-2xl text-base text-[#C2CDF3] sm:text-lg md:text-xl lg:text-2xl">
            Connect with mentors and get quick answers to your coding questions.
          </p>
          {/* Use the dynamically determined path */}
          <Link
            to={getStartedPath()}
            className="rounded-xl bg-[#8681E9] px-8 py-4 text-lg font-medium text-[#DBEAFD] shadow-lg hover:bg-[#726ECF] md:px-10 md:py-5 md:text-xl"
            aria-label="Get Started"
          >
            Get Started
          </Link>
        </section>

        {/* Features Section */}
        <section className="mx-auto mb-12 w-11/12 max-w-6xl py-8 md:py-12">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
            {/* Feature 1 */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#4A3D73]/20 to-[#6A5A9B]/30 p-6 text-center shadow-lg backdrop-blur-md md:p-8">
              <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#9C7FFD] to-[#6A4FEA]">
                <span className="text-xl font-bold text-white">?</span>
              </div>
              <h3 className="text-lg font-medium text-[#D3DCF5] sm:text-xl lg:text-2xl">
                Post Your Doubts
              </h3>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#4A3D73]/20 to-[#6A5A9B]/30 p-6 text-center shadow-lg backdrop-blur-md md:p-8">
              <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#FF70A6] to-[#E63D8B]">
                <span className="text-xl font-bold text-white">★</span>
              </div>
              <h3 className="text-lg font-medium text-[#DBDCFA] sm:text-xl lg:text-2xl">
                Expert Mentorship
              </h3>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-[#4A3D73]/20 to-[#6A5A9B]/30 p-6 text-center shadow-lg backdrop-blur-md md:p-8">
              <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#5AD8CD] to-[#3AA599]">
                <span className="text-xl font-bold text-white">✓</span>
              </div>
              <h3 className="text-lg font-medium text-[#E8E4FE] sm:text-xl lg:text-2xl">
                Track & Resolve
              </h3>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto py-6 text-center md:py-8">
          <div className="flex flex-col items-center justify-center space-y-2 md:flex-row md:space-x-6 md:space-y-0">
            <Link to="/privacy" className="text-[#8EAAE0] text-sm hover:text-white md:text-base">
              Privacy
            </Link>
            <Link to="/terms" className="text-[#9BB1E5] text-sm hover:text-white md:text-base">
              Terms
            </Link>
            <Link to="/contact" className="text-[#95ACE5] text-sm hover:text-white md:text-base">
              Contact
            </Link>
            <div className="flex space-x-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#CDC3FE] to-[#A89BFF]">
                <span className="text-xs font-bold">f</span>
              </div>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-[#CABEFE] to-[#9EA7FF]">
                <span className="text-xs font-bold">in</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;