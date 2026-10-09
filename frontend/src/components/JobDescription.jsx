import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const { singleJob, allJobs } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    const { id: jobId } = useParams();
    const dispatch = useDispatch();

    const isRecruiter = user?.role === 'recruiter';

    const [loading, setLoading] = useState(true);
    const [isApplied, setIsApplied] = useState(false);
    const [applying, setApplying] = useState(false);

    // Check whether the currently selected job matches this URL.
    const currentJob =
        singleJob?._id === jobId
            ? singleJob
            : allJobs?.find(job => job._id === jobId);

    useEffect(() => {
        const controller = new AbortController();

        const fetchSingleJob = async () => {
            // Use cached job data immediately when available.
            if (currentJob) {
                dispatch(setSingleJob(currentJob));

                setIsApplied(
                    currentJob.applications?.some(application =>
                        (typeof application.applicant === 'object'
                            ? application.applicant?._id
                            : application.applicant
                        ) === user?._id
                    ) || false
                );

                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get/${jobId}`,
                    {
                        withCredentials: true,
                        signal: controller.signal
                    }
                );

                if (res.data.success) {
                    const job = res.data.job;

                    dispatch(setSingleJob(job));

                    setIsApplied(
                        job.applications?.some(application =>
                            (typeof application.applicant === 'object'
                                ? application.applicant?._id
                                : application.applicant
                            ) === user?._id
                        ) || false
                    );
                }
            } catch (error) {
                if (error.code !== 'ERR_CANCELED') {
                    console.error('Error fetching job:', error);
                    toast.error(
                        error.response?.data?.message ||
                        'Failed to load job details'
                    );
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchSingleJob();

        return () => controller.abort();
    }, [jobId, user?._id, dispatch]);

    const applyJobHandler = async () => {
        if (applying || isApplied) return;

        try {
            setApplying(true);

            const res = await axios.get(
                `${APPLICATION_API_END_POINT}/apply/${jobId}`,
                { withCredentials: true }
            );

            if (res.data.success) {
                setIsApplied(true);

                if (currentJob) {
                    dispatch(setSingleJob({
                        ...currentJob,
                        applications: [
                            ...(currentJob.applications || []),
                            { applicant: user?._id }
                        ]
                    }));
                }

                toast.success(res.data.message);
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            toast.error(
                error.response?.data?.message || 'Something went wrong'
            );
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto my-10 px-4">
                <div className="animate-pulse space-y-5">
                    <div className="h-8 bg-gray-200 rounded w-1/3" />
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                    <div className="h-32 bg-gray-200 rounded" />
                    <div className="h-5 bg-gray-200 rounded w-2/3" />
                </div>
                <p className="text-center text-gray-500 mt-5">
                    Loading job details...
                </p>
            </div>
        );
    }

    if (!currentJob) {
        return (
            <div className="max-w-7xl mx-auto my-10 px-4 text-center">
                <h2 className="text-xl font-semibold">Job not found</h2>
                <p className="text-gray-500 mt-2">
                    This job may have been removed or is unavailable.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto my-10 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                <div className="flex items-center gap-4">
                    {currentJob.company?.logo && (
                        <img
                            src={currentJob.company.logo}
                            alt={currentJob.company?.name || 'Company'}
                            loading="lazy"
                            className="w-16 h-16 object-contain border rounded-lg p-2"
                        />
                    )}

                    <div>
                        <h2 className="font-bold text-xl">
                            {currentJob.company?.name}
                        </h2>

                        <h1 className="font-bold text-xl mt-1">
                            {currentJob.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-2 mt-4">
                            <Badge className="text-blue-700 font-bold" variant="ghost">
                                {currentJob.position} Positions
                            </Badge>

                            <Badge className="text-[#F83002] font-bold" variant="ghost">
                                {currentJob.jobType}
                            </Badge>

                            <Badge className="text-[#7209b7] font-bold" variant="ghost">
                                {currentJob.salary} LPA
                            </Badge>

                            <Badge
                                className={
                                    currentJob.status === 'Open'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }
                            >
                                {currentJob.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                {!isRecruiter && (
                    <Button
                        onClick={applyJobHandler}
                        disabled={isApplied || applying}
                        className={`rounded-lg ${
                            isApplied
                                ? 'bg-gray-600 cursor-not-allowed'
                                : 'bg-[#7209b7] hover:bg-[#5f32ad]'
                        }`}
                    >
                        {applying
                            ? 'Applying...'
                            : isApplied
                                ? 'Already Applied'
                                : 'Apply Now'}
                    </Button>
                )}
            </div>

            <h1 className="border-b-2 border-b-gray-300 font-medium py-4">
                Job Description
            </h1>

            <div className="my-4 space-y-2">
                <p>
                    <strong>Role:</strong> {currentJob.title}
                </p>

                <p>
                    <strong>Location:</strong> {currentJob.location}
                </p>

                <p>
                    <strong>Description:</strong> {currentJob.description}
                </p>

                <p>
                    <strong>Status:</strong>{' '}
                    <span className={
                        currentJob.status === 'Open'
                            ? 'text-green-600 font-semibold'
                            : 'text-red-600 font-semibold'
                    }>
                        {currentJob.status}
                    </span>
                </p>

                <p>
                    <strong>Experience:</strong> {currentJob.experienceLevel} yrs
                </p>

                <p>
                    <strong>Salary:</strong> {currentJob.salary} LPA
                </p>

                <p>
                    <strong>Total Applicants:</strong>{' '}
                    {currentJob.applications?.length ?? 0}
                </p>

                <p>
                    <strong>Posted Date:</strong>{' '}
                    {currentJob.createdAt?.split('T')[0] || 'N/A'}
                </p>
            </div>
        </div>
    );
};

export default JobDescription;
