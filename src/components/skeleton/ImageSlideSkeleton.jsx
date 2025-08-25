import { useState } from "react";
import Skeleton from "@mui/material/Skeleton";


const ImageSkeletonEmpty = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`${className} relative`}>
      {!loaded && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          className={`absolute top-0 left-0 z-10  rounded-md`}
        />
        )}
   <img
        decoding="async"
        loading="lazy"
        src={src}
        alt={alt}
        className={`${!loaded ? "opacity-0" : "opacity-100"}  w-full h-full object-cover transition-all duration-500 `}
        onLoad={() => setLoaded(true)}
      />

</div>
  );
};


export default ImageSkeletonEmpty;