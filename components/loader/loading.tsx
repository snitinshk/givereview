import React from 'react'

const Loading: React.FC = () => {
  return (
    <div className="flex z-10 flex-col backdrop-blur-sm items-center justify-center h-full absolute left-0 top-0 w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
    </div>
  )
}

export default Loading;