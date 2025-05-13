import React from "react";
import userImage from "../assets/images/user.jpg"; 
import myImage from "../assets/images/Official Profile.png"; 

const About = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-6 lg:px-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-700 mb-6 text-center">
           District Transfer Management System
        </h1>

        <p className="text-gray-700 text-lg mb-4 leading-relaxed text-center">
          The <strong className="font-semibold">District Transfer Management System (DTMS)</strong> is a digital solution designed to
          streamline public employee transfers within the <strong className="font-semibold">Divisional Secretariat of Ampara, Sri Lanka</strong>.
          It enhances transparency, efficiency, and accountability in transfer-related processes.
        </p>

        <p className="text-gray-700 text-lg mb-8 leading-relaxed text-center">
          Developed using the robust <strong className="font-semibold">MERN stack</strong> (MongoDB, Express.js, React.js, Node.js), DTMS offers
          intuitive interfaces for requesting transfers, tracking application status, and receiving real-time updates.
        </p>

        <div className="p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Development Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Developer 1 */}
          <div className="bg-white p-6 rounded-lg border border-gray-100 relative">
  <div className="absolute top-4 right-4 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    Team Lead
  </div>
  <img
    src={myImage}
    alt="NM Nousad"
    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-300"
  />
  <h3 className="text-xl font-bold text-center text-gray-900">
    👨‍💻 Mohamed Nousad
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
            <div className="bg-white p-6 rounded-lg  border border-gray-100">
              <img
                src={userImage}
                alt="Nuzla Razzom"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-300"
              />
              <h3 className="text-xl font-bold text-center text-gray-900">
                👩‍💻 Nuzla Razzom
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
            <div className="bg-white p-6 rounded-lg  border border-gray-100">
              <img
                src={userImage}
                alt="Midusheka Kuntrukumaren"
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-300"
              />
              <h3 className="text-xl font-bold text-center text-gray-900">
                👩‍💻 Midusheka Kuntrukumaren
              </h3>
              <p className="text-center text-sm text-gray-600 mb-2">
                Front-End Developer
              </p>
              <p className="text-gray-600 text-sm text-justify">
                Focused on dynamic component design, smooth interactions, and visual consistency across devices.
                Brings precision and usability to every front-end screen using React.js and Tailwind.
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