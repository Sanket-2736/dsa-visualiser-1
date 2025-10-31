import React from 'react';
import { Link } from 'react-router-dom';

const DescriptionCard = ({ title, description, link }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-2 text-blue-800">{title}</h2>
      <p className="text-gray-700 mb-4">{description}</p>
      <Link
        to={link}
        className="inline-block bg-blue-800 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Explore {title}
      </Link>
    </div>
  );
};

export default DescriptionCard;
