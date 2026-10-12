
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
                        headers: {
                            'Cache-Control': 'no-cache'
                        },
                        params: {
                            _t: Date.now()
                        }
                    }
                );

                if (!cancelled && res.data.success) {
                    dispatch(setAllJobs(
                        Array.isArray(res.data.jobs)
                            ? res.data.jobs
                            : []
                    ));
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
