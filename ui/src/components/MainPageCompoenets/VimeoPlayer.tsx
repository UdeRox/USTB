import React from 'react';

interface VimeoPlayerProps {
  videoId: string;
}

const VimeoPlayer: React.FC<VimeoPlayerProps> = ({ videoId }) => {
  return (
    <div className="flex justify-center bg-gray-200 items-center my-8 rounded-3xl bg-gray-100">
      <div className="w-full  max-w-screen-lg p-4 bg-gray-500 my-10 rounded-lg shadow-lg">
        <div className="relative pb-[56.25%] h-0">
          <iframe
            title="vimeo-player"
            src={`https://player.vimeo.com/video/${videoId}?h=b9e0d35dd5`}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default VimeoPlayer;
