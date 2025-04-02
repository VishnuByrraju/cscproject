import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function CardQuestionComponent({ cardTitle = 'Title', cardDescription = 'This is description', to }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={to}
      className="lg:w-80 w-full mt-2 mr-2 block p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 h-auto overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ height: isHovered ? 'auto' : '12rem' }}
    >
      {/* Title */}
      <div
        className={`mb-2 px-2 w-min rounded-xl border-solid border-2 
                    ${cardTitle === 'Reading' ? 'border-red-100' : 'border-blue-100'} outline-1 outline-offset-2 
                    ${cardTitle === 'Reading' ? 'bg-red-50' : 'bg-blue-50'} text-end text-1xl flex items-center justify-center`}
      >
        <div
          className={`h-2 w-2 mr-2 rounded-lg 
                      ${cardTitle === 'Reading' ? 'bg-red-500' : 'bg-blue-500'}`}
        ></div>
        {cardTitle}
      </div>

      {/* Description */}
      <div className="p-1 mt-5">
        <p className="font-normal text-gray-700">
          {isHovered ? cardDescription : `${cardDescription.slice(0, 50)}${cardDescription.length > 50 ? '...' : ''}`}
        </p>
      </div>
    </Link>
  );
}

export default CardQuestionComponent;
