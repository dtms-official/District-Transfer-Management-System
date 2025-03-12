import React from "react";
import logo from "../assets/images/logo.png";

const Header = () => {
  return (
    <div className="hidden md:flex items-center space-x-4 absolute top-5 left-5">
      <img src={logo} alt="Logo" className="w-16 h-auto" />
      <div>
        <h2 className="text-2xl font-bold text-gray-100">
          District Transfer <br /> Management System
        </h2>
        <h4 className="text-sm text-blue-600">District Secretariat, Ampara</h4>
      </div>
    </div>
  );
};

export default Header;
