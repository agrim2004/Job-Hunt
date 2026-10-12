
import { setAllJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const useGetAllJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        let cancelled = false;

        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get`,
                    {
                        withCredentials: true,
                        params: { _t: Date.now() }
                    }
                );

                console.log('API success:', res.data.success);
                console.log('API jobs count:', res.data.jobs?.length);

                if (!cancelled && res.data.success) {
                    const jobs = Array.isArray(res.data.jobs)
                        ? res.data.jobs
                        : [];

                    dispatch(setAllJobs(jobs));
                    console.log('Jobs dispatched to Redux:', jobs.length);
                }
            } catch (error) {
                console.error(
                    'Error fetching jobs:',
                    error.response?.data || error.message
                );
            }
        };

        fetchAllJobs();

        return () => {
            cancelled = true;
        };
    }, [dispatch]);
};

export default useGetAllJobs;
