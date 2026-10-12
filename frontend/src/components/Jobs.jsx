
import { useMemo } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import useGetAllJobs from '@/hooks/useGetAllJobs';

const salaryRanges = {
    '0-3 LPA': [0, 3],
    '3-5 LPA': [3, 5],
    '5-8 LPA': [5, 8],
    '8-12 LPA': [8, 12],
    '12-20 LPA': [12, 20],
    '20+ LPA': [20, Infinity]
};

const Jobs = () => {
    useGetAllJobs();

    const {
        allJobs = [],
        searchedQuery,
        selectedLocation,
        selectedRole,
        selectedSalary
    } = useSelector(store => store.job);
    console.log("Jobs page received:", allJobs?.length);
        console.log("Active filters:", {
            searchedQuery,
            selectedLocation,
            selectedRole,
            selectedSalary
        });

    const filterJobs = useMemo(() => {
        let jobs = Array.isArray(allJobs) ? [...allJobs] : [];

        if (searchedQuery?.trim()) {
            const query = searchedQuery.trim().toLowerCase();

            jobs = jobs.filter(job =>
                (job.title || '').toLowerCase().includes(query) ||
                (job.description || '').toLowerCase().includes(query) ||
                (job.location || '').toLowerCase().includes(query) ||
                (job.company?.name || '').toLowerCase().includes(query)
            );
        }

        if (selectedLocation) {
            jobs = jobs.filter(job =>
                (job.location || '').toLowerCase().includes(
                    selectedLocation.toLowerCase()
                )
            );
        }

        if (selectedRole) {
            jobs = jobs.filter(job =>
                (job.title || '').toLowerCase().includes(
                    selectedRole.toLowerCase()
                )
            );
        }

        if (selectedSalary && salaryRanges[selectedSalary]) {
            const [min, max] = salaryRanges[selectedSalary];

            jobs = jobs.filter(job => {
                const salary = Number(job.salary);
                return Number.isFinite(salary) && salary >= min && salary < max;
            });
        }

        return jobs;
    }, [
        allJobs,
        searchedQuery,
        selectedLocation,
        selectedRole,
        selectedSalary
    ]);

    return (
        <div>
            <Navbar />

            <div className="max-w-7xl mx-auto mt-5 px-3">
                <div className="flex flex-col md:flex-row gap-5">
                    <div className="w-full md:w-1/5">
                        <FilterCard />
                    </div>

                    <div className="flex-1 h-[88vh] overflow-y-auto pb-5">
                        {filterJobs.length === 0 ? (
                            <div className="text-center py-10">
                                <h2 className="text-lg font-semibold">
                                    No Jobs Available
                                </h2>
                                <p className="text-gray-500 mt-2">
                                    Try changing or clearing your filters.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filterJobs.map(job => (
                                    <motion.div
                                        key={job._id}
                                        initial={{ opacity: 0, x: 30 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Job job={job} />
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
