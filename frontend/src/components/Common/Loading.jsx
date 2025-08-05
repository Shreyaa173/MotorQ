import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ message = 'Loading...', size = 'default' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`${sizeClasses[size]} text-blue-600 animate-spin mb-4`} />
      <p className="text-gray-600 text-sm">{message}</p>
    </div>
  );
};

export default Loading;