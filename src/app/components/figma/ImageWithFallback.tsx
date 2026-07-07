import React, { useState } from 'react'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  const [didError, setDidError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setDidError(true)
    setIsLoading(false)
    if (props.onError) props.onError(e)
  }

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoading(false)
    if (props.onLoad) props.onLoad(e)
  }

  const { src, alt, style, className, onLoad, onError, ...rest } = props

  return (
    <>
      {isLoading && !didError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/30 backdrop-blur-sm z-10 pointer-events-none rounded-[inherit]">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FF6022] rounded-full animate-spin"></div>
        </div>
      )}
      {didError ? (
        <div className={`flex items-center justify-center w-full h-full bg-gray-100 ${className || ''}`} style={style}>
          <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} className="opacity-50 max-w-[50%] max-h-[50%]" />
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className={`${className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`} 
          style={style} 
          {...rest} 
          onError={handleError} 
          onLoad={handleLoad} 
        />
      )}
    </>
  )
}
