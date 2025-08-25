
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const baseColor = "#d0e1f9";
const highlightColor = "#f0f5ff";

export const HeadingSkeleton = () => {
    return (
        <>
            <Skeleton width={500} height={50} baseColor={`${baseColor}`} highlightColor={`${highlightColor}`} />
        </>
    );
}

export const DescriptionSkeleton = () => {
    return (
        <>
            <div className="flex flex-col items-start gap-3">
                <div className="flex gap-5">
                    <Skeleton width={180} height={16} baseColor={`${baseColor}`} highlightColor={`${highlightColor}`} />
                    <Skeleton width={220} height={16} baseColor={`${baseColor}`} highlightColor={`${highlightColor}`} />
                </div>
                <Skeleton width={440} height={16} baseColor={`${baseColor}`} highlightColor={`${highlightColor}`} />
            </div>
        </>

    )
}

export const ImageSkeleton = () => {
    return (
        <>
            <Skeleton className="absolute inset-0 w-full h-full" baseColor={`${baseColor}`} highlightColor={`${highlightColor}`} />
        </>
    );
}


export const LongBlogContentSkeleton = () => {
    return (
        <>
            <Skeleton width="90%" height={20} baseColor={`${baseColor}`} highlightColor={`${highlightColor}`} />
            <Skeleton width="95%" height={20} baseColor={`${baseColor}`} highlightColor={`${highlightColor}`} />
            <Skeleton width="85%" height={20} baseColor={`${baseColor}`} highlightColor={`${highlightColor}`} />
            <Skeleton width="92%" height={20} baseColor={`${baseColor}`} highlightColor={`${highlightColor}`} />
        </>
    );
}