const geolib = require("geolib");

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  return (
    geolib.getDistance(
      { latitude: lat1, longitude: lon1 },
      { latitude: lat2, longitude: lon2 }
    ) / 1000
  ).toFixed(2);
};

exports.calculateWorkplaceDistance = async (user, workplaces) => {
  const [wp1, wp2, wp3] = workplaces;
  
  const distances = [
    {
      id: wp1._id,
      name: wp1.workplace,
      distance: calculateDistance(
        user.GPS_latitude,
        user.GPS_longitude,
        wp1.GPS_latitude,
        wp1.GPS_longitude
      )
    },
    {
      id: wp2._id,
      name: wp2.workplace,
      distance: calculateDistance(
        user.GPS_latitude,
        user.GPS_longitude,
        wp2.GPS_latitude,
        wp2.GPS_longitude
      )
    },
    {
      id: wp3._id,
      name: wp3.workplace,
      distance: calculateDistance(
        user.GPS_latitude,
        user.GPS_longitude,
        wp3.GPS_latitude,
        wp3.GPS_longitude
      )
    }
  ];

  distances.sort((a, b) => a.distance - b.distance);

  return distances.map((wp, index) => ({
    workplace_id: wp.id,
    workplace: wp.name,
    distance: wp.distance,
    category: index === 0 ? "Prefered" : index === 1 ? "Moderate" : "Difficult"
  }));
};