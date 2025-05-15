import React from "react";
import logo from "../assets/images/logo.png";

const Header = () => {
  return (
    <div className="hidden md:flex items-center space-x-4 absolute top-5 left-5">
      <img src={logo} alt="Logo" className="w-16 h-auto" />
      <div>
        <h2 className="text-2xl font-bold text-white drop-shadow-[0_3px_6px_rgba(0,0,0,0.7)]">
          District Transfer <br /> Management System
        </h2>

        <h4 className="text-sm text-blue-700 drop-shadow-sm">
          District Secretariat, Ampara
        </h4>
      </div>
    </div>
  );
};

export default Header;
