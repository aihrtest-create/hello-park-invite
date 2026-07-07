import React, { useState } from 'react';

export function VideoWithFallback(props: React.VideoHTMLAttributes<HTMLVideoElement>) {
  const [isLoading, setIsLoading] = useState(true);
  const [didError, setDidError] = useState(false);

  const handleLoadedData = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setIsLoading(false);
    if (props.onLoadedData) props.onLoadedData(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    setDidError(true);
    setIsLoading(false);
    if (props.onError) props.onError(e);
  };

  const { className, style, onLoadedData, onError, ...rest } = props;

  return (
    <>
      {isLoading && !didError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/30 backdrop-blur-sm z-10 pointer-events-none rounded-[inherit]">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FF6022] rounded-full animate-spin"></div>
        </div>
      )}
      {didError ? (
        <div className={`flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm ${className || ''}`}>
          Failed to load video
        </div>
      ) : (
        <video
          className={`${className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          style={style}
          onLoadedData={handleLoadedData}
          onError={handleError}
          {...rest}
        />
      )}
    </>
  );
}
