import React from "react";

const VideoPlayer = ({ src, className }) => {
  return (
    <video className={`${className}`} src={src} controls>
      Sorry, your browser doesn't support HTML5 <code>video</code>, but you can download this video
      from the
      <a href="https://archive.org/details/Popeye_forPresident" target="_blank">
        Internet Archive
      </a>
      .
    </video>
  );
};

export default VideoPlayer;
