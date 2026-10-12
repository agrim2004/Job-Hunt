import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import useGetAllJobs from "@/hooks/useGetAllJobs";

import {
  setSearchedQuery,
  setSelectedLocation,
  setSelectedRole,
  setSelectedSalary,
} from "@/redux/jobSlice";

const Jobs = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  useGetAllJobs();

  const {
    allJobs = [],
    selectedLocation = "",
    selectedRole = "",
    selectedSalary = "",
  } = useSelector((store) => store.job);

  const searchQuery = searchParams.get("search") || "";

  // Reset saved search and filters only when the browser is refreshed.
  useEffect(() => {
    const navigation = performance.getEntriesByType("navigation")[0];

    if (navigation?.type === "reload") {
      dispatch(setSearchedQuery(""));
      dispatch(setSelectedLocation(""));
      dispatch(setSelectedRole(""));
      dispatch(setSelectedSalary(""));
      setSearchParams({}, { replace: true });
    }
  }, [dispatch, setSearchParams]);

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      // Search across job title, description, company, location and requirements.
      const searchText = searchQuery.trim().toLowerCase();

      const companyName =
        typeof job.company === "object"
          ? job.company?.name || ""
          : job.company || "";

      const requirements = Array.isArray(job.requirements)
        ? job.requirements.join(" ")
        : job.requirements || "";

      const searchableText = [
        job.title,
        job.description,
        job.location,
        companyName,
        requirements,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchText || searchableText.includes(searchText);

      // Match location.
      const matchesLocation =
        !selectedLocation ||
        String(job.location || "")
          .toLowerCase()
          .includes(String(selectedLocation).toLowerCase());

      // Match role, ignoring spaces and letter case.
      const normalize = (value) =>
        String(value || "")
          .toLowerCase()
          .replace(/[\s-]/g, "");

      const matchesRole =
        !selectedRole ||
        normalize(job.title).includes(normalize(selectedRole));

      // Match the selected salary bracket.
      const salary = Number(job.salary);

      let matchesSalary = true;

      if (selectedSalary) {
        const salaryRange = String(selectedSalary)
          .toLowerCase()
          .match(/(\d+)\s*-\s*(\d+)/);

        const aboveRange = String(selectedSalary)
          .toLowerCase()
          .match(/(\d+)\s*\+/);

        if (salaryRange) {
          const min = Number(salaryRange[1]);
          const max = Number(salaryRange[2]);

          matchesSalary =
            Number.isFinite(salary) &&
            salary >= min &&
            salary < max;
        } else if (aboveRange) {
          const min = Number(aboveRange[1]);

          matchesSalary =
            Number.isFinite(salary) && salary >= min;
        }
      }

      return (
        matchesSearch &&
        matchesLocation &&
        matchesRole &&
        matchesSalary
      );
    });
  }, [
    allJobs,
    searchQuery,
    selectedLocation,
    selectedRole,
    selectedSalary,
  ]);

  const clearSearch = () => {
    setSearchParams({}, { replace: true });
    dispatch(setSearchedQuery(""));
  };

  return (
    <div>
      <Navbar />

      <div className="mx-auto mt-5 max-w-7xl px-4">
        <div className="flex flex-col gap-5 md:flex-row">
          {/* Filters */}
          <div className="w-full md:w-1/5">
            <FilterCard />
          </div>

          {/* Job listings */}
          <div className="w-full md:w-4/5">
            {searchQuery && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-gray-600">
                  Search results for:{" "}
                  <span className="font-semibold text-gray-900">
                    {searchQuery}
                  </span>
                </p>

                <button
                  type="button"
                  onClick={clearSearch}
                  className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-100"
                >
                  Clear Search
                </button>
              </div>
            )}

            {filteredJobs.length === 0 ? (
              <div className="py-10 text-center">
                <h2 className="text-lg font-semibold">
                  No jobs found
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
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
