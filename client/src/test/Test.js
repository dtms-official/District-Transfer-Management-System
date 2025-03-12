// import React, { useState, useEffect, Suspense } from "react";
// import { Line } from "react-chartjs-2";
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// const PerformanceTest = ({ Component }) => {
//   const [userCount, setUserCount] = useState(0);
//   const [cpuUsage, setCpuUsage] = useState(0);
//   const [renderCount, setRenderCount] = useState(0);
//   const [performanceData, setPerformanceData] = useState({ labels: [], values: [] });
//   const [userData, setUserData] = useState({ labels: [], values: [] });
//   const [highTrafficData, setHighTrafficData] = useState({ labels: [], values: [] });

//   // Update data for charts
//   const updateChartData = () => {
//     setPerformanceData((prevData) => ({
//       labels: [...prevData.labels, new Date().toLocaleTimeString()],
//       values: [...prevData.values, performance.now()],
//     }));

//     setUserData((prevData) => ({
//       labels: [...prevData.labels, new Date().toLocaleTimeString()],
//       values: [...prevData.values, userCount],
//     }));
//   };

//   const updateHighTrafficData = () => {
//     setHighTrafficData((prevData) => ({
//       labels: [...prevData.labels, new Date().toLocaleTimeString()],
//       values: [...prevData.values, 1000],
//     }));
//   };

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setUserCount(1000); // Simulate 1000 users at once
//       setCpuUsage(Math.random() * 100); // Random CPU usage value
//       setRenderCount((prev) => prev + 1);
//       updateChartData();
//       updateHighTrafficData();
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   // Charts for User Count and Performance
//   const userCountChart = {
//     labels: userData.labels,
//     datasets: [
//       {
//         label: "User Count (Normal)",
//         data: userData.values,
//         fill: false,
//         borderColor: "rgba(75, 192, 192, 1)",
//         tension: 0.1,
//       },
//       {
//         label: "User Count (High Traffic)",
//         data: highTrafficData.values,
//         fill: false,
//         borderColor: "rgba(255, 99, 132, 1)",
//         tension: 0.1,
//       },
//     ],
//   };

//   const performanceChart = {
//     labels: performanceData.labels,
//     datasets: [
//       {
//         label: "Render Time (Normal)",
//         data: performanceData.values,
//         fill: false,
//         borderColor: "rgba(54, 162, 235, 1)",
//         tension: 0.1,
//       },
//     ],
//   };

//   return (
//     <div>
//       <h2>Performance Test</h2>
//       <Suspense fallback={<h1>Loading...</h1>}>
//         <Component />
//       </Suspense>
//       <h3>User Count: {userCount}</h3>
//       <h3>Render Count: {renderCount}</h3>
//       <h3>CPU Usage: {cpuUsage.toFixed(2)}%</h3>

//       {/* User Count Comparison Chart */}
//       <Line data={userCountChart} />
//       {/* Render Time Performance Chart */}
//       <Line data={performanceChart} />
//     </div>
//   );
// };

// export default PerformanceTest;


// This test file measures the performance of your React application by tracking CPU usage, load time, and render time. It simulates high traffic (e.g., 1000 users), generates performance data, and displays it on charts for analysis. It helps assess how the app behaves under stress and identifies potential performance bottlenecks.







