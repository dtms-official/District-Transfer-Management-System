// import { useEffect, useState } from "react";
// import axios from "axios";

// export const getWorkplace = () => {
//   const [workplaceData, setWorkplaceData] = useState([]);
//   const [workplaceDataloading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchWorkplaces = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get(
//           `${process.env.REACT_APP_API_URL}/workplace/:id`
//         ); // Uses base URL from React app
//         setWorkplaceData(response.data);
//       } catch (error) {
//         console.error("Error fetching workplaces:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchWorkplaces();
//   }, []);

//   return { workplaceData , workplaceDataloading };
// };
