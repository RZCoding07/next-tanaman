import React from 'react';
import Skeleton from 'react-loading-skeleton';

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center w-full">
      <div className="w-full rounded-full h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse">
        <Skeleton height={20} />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
