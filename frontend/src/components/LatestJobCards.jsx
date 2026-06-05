import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const LatestJobCards = ({ job }) => {
const navigate = useNavigate();


return (
    <div
        onClick={() => navigate(`/description/${job._id}`)}
        className='p-5 rounded-xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white border border-gray-100 cursor-pointer'
    >
        {/* Company Info */}
        <div className='flex items-center gap-3'>
            <Avatar className="h-12 w-12">
                <AvatarImage src={job?.company?.logo} />
                <AvatarFallback>
                    {job?.company?.name?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            <div>
                <h1 className='font-semibold text-lg'>
                    {job?.company?.name}
                </h1>

                <p className='text-sm text-gray-500'>
                    {job?.location || "India"}
                </p>
            </div>
        </div>

        {/* Job Info */}
        <div className='mt-4'>
            <h1 className='font-bold text-xl text-gray-900'>
                {job?.title}
            </h1>

            <p className='text-sm text-gray-600 mt-2 line-clamp-2'>
                {job?.description}
            </p>
        </div>

        {/* Badges */}
        <div className='flex flex-wrap items-center gap-2 mt-5'>

            <Badge
                className='bg-blue-50 text-blue-700 hover:bg-blue-50'
                variant="ghost"
            >
                {job?.position} Positions
            </Badge>

            <Badge
                className='bg-orange-50 text-orange-700 hover:bg-orange-50'
                variant="ghost"
            >
                {job?.jobType}
            </Badge>

            <Badge
                className='bg-purple-50 text-purple-700 hover:bg-purple-50'
                variant="ghost"
            >
                {job?.salary} LPA
            </Badge>

            <Badge
                variant="ghost"
                className={
                    job?.status === "Open"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                }
            >
                {job?.status}
            </Badge>

        </div>

        {/* Footer */}
        <div className='flex items-center justify-between mt-5 pt-4 border-t'>
            <p className='text-xs text-gray-500'>
                Posted: {job?.createdAt?.split("T")[0]}
            </p>

            <span className='text-sm font-medium text-[#6A38C2]'>
                View Details →
            </span>
        </div>
    </div>
)


}

export default LatestJobCards
