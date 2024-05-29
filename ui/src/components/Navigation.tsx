import React, { useState } from 'react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    console.log("Button clicked");
    if (isOpen) {
      setIsOpen(false);
      console.log("Menu closed");
    } else {
      setIsOpen(true);
      console.log("Menu opened");
    }
  };

  return (
    <nav className="bg-gray-200 text-xl font-bold text-black ">
      {/* Mobile Navigation */}
      <div className="md:hidden flex justify-between items-center">
        {/* <a href="/" className="text-2xl">Logo</a> */}
        <button onClick={toggleMenu} className="focus:outline-none">
          <svg
            className="w-8 h-8 text-black"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed bg-white flex flex-col justify-center align-center z-50 text-center h-screen w-screen flex flex-col mt-2 space-y-2">
          <a href="/" className="hover:text-white hover:bg-black p-2 rounded-2xl transition duration-300">Home</a>
          <a href="/tbill" className="block px-4 py-2 hover:bg-gray-100">Buy</a>
          <a href="/redeem" className="block px-4 py-2 hover:bg-gray-100">Sell</a>
          <a href="/blog/" className="hover:text-white hover:bg-black p-2 rounded-2xl transition duration-300">Blog</a>
          <a href="/aboutus/" className="hover:text-white hover:bg-black p-2 rounded-2xl transition duration-300">About Us</a>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-col md:flex-row items-center space-x-6">
        <a href="/" className="hover:text-white hover:bg-black p-2 rounded-2xl transition duration-300">Home</a>

        <div className="relative group">
          <button className="hover:text-white hover:bg-black p-2 rounded-2xl transition duration-300">TBILL</button>
          <div className="absolute hidden z-50 group-hover:block bg-white text-black mt-1 rounded shadow-lg border border-gray-200">
            <a href="/tbill" className="block px-4 py-2 hover:bg-gray-100">Buy</a>
            <a href="/redeem" className="block px-4 py-2 hover:bg-gray-100">Sell</a>
          </div>
        </div>

        <a href="/blog/" className="hover:text-white hover:bg-black p-2 rounded-2xl transition duration-300">Blog</a>
        <a href="/aboutus/" className="hover:text-white hover:bg-black p-2 rounded-2xl transition duration-300">About Us</a>
      </div>
    </nav>
  );
};

export default Navigation;
