import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';

const LatestJobs = () => {
    const { allJobs } = useSelector(store => store.job);

    return (
        <div className='max-w-7xl mx-auto my-10 px-4'>
            {/* Heading */}
            <h1 className='text-4xl font-bold text-center mb-10'>
                <span className='text-[#6A38C2]'>Latest & Top </span>
                Job Openings
            </h1>

            {/* Job Cards */}
            {allJobs.length <= 0 ? (
                <p className='text-center text-gray-500'>
                    No Jobs Available
                </p>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {allJobs.slice(0, 6).map((job) => (
                        <LatestJobCards
                            key={job._id}
                            job={job}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default LatestJobs;