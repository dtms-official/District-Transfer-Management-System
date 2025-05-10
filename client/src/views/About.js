import React from "react";
import userImage from "../assets/images/user.jpg"; 
import myImage from "../assets/images/Official Profile.png"; 

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">
          About District Transfer Management System
        </h1>

        <p className="text-gray-700 text-lg mb-4 leading-relaxed text-center">
          The <strong>District Transfer Management System (DTMS)</strong> is a digital solution designed to
          streamline public employee transfers within the <strong>Divisional Secretariat of Ampara, Sri Lanka</strong>.
          It enhances transparency, efficiency, and accountability in transfer-related processes.
        </p>

        <p className="text-gray-700 text-lg mb-8 leading-relaxed text-center">
          Developed using the robust <strong>MERN stack</strong> (MongoDB, Express.js, React.js, Node.js), DTMS offers
          intuitive interfaces for requesting transfers, tracking application status, and receiving real-time updates.
        </p>

        <div className="bg-white shadow-xl rounded-xl p-8">
          <h2 className="text-2xl font-semibold text-blue-600 mb-6 text-center">
            Meet the Development Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Developer 1 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src={myImage}
                alt="NM Nousad"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
              />
              <h3 className="text-xl font-bold text-center text-gray-800">
                👨‍💻 NM Nousad
              </h3>
              <p className="text-center text-sm text-gray-600 mb-2">
                Team Lead & Full-Stack Developer
              </p>
              <p className="text-gray-600 text-sm text-justify">
                Passionate full-stack developer experienced in secure and scalable web apps. Leading the DTMS
                development while interning in software development. Delivered 12+ full-stack projects and specialized
                in React, Node.js, and cloud integrations.
              </p>
            </div>

            {/* Developer 2 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src={userImage}
                alt="Nuzla Razzom"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
              />
              <h3 className="text-xl font-bold text-center text-gray-800">
                👩‍💻 Nuzla Razool
              </h3>
              <p className="text-center text-sm text-gray-600 mb-2">
                Front-End Developer
              </p>
              <p className="text-gray-600 text-sm text-justify">
                Expert in creating responsive UI using React, Tailwind CSS, and Bootstrap. Dedicated to crafting
                pixel-perfect interfaces that enhance user experience and accessibility.
              </p>
            </div>

            {/* Developer 3 */}
            <div className="bg-gray-100 p-6 rounded-lg shadow hover:shadow-lg transition">
              <img
                src={userImage}
                alt="Midushekaa Kunrakumaren"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
              />
              <h3 className="text-xl font-bold text-center text-gray-800">
                👩‍💻 Midushekaa Kunrakumaren
              </h3>
              <p className="text-center text-sm text-gray-600 mb-2">
                Front-End Developer
              </p>
              <p className="text-gray-600 text-sm text-justify">
               Specializes in dynamic component design, smooth interactions, and visual consistency across devices. 
               Brings precision and usability to every front-end screen using React.js and Tailwind CSS.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} District Secretariat Ampara – All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default About;
