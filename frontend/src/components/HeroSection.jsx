import { useState } from "react";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
const [query, setQuery] = useState("");
const dispatch = useDispatch();
const navigate = useNavigate();

const searchJobHandler = () => {
dispatch(setSearchedQuery(query));
navigate("/browse");
};

const popularSearches = [
"Frontend Developer",
"Backend Developer",
"Full Stack Developer",
"UI/UX Designer",
"Data Analyst",
];

return ( <section className="bg-gradient-to-br from-violet-50 via-white to-purple-50"> <div className="max-w-7xl mx-auto px-4 pt-16 pb-6">


    {/* Badge */}
    <div className="flex justify-center">
      <span className="px-5 py-2 rounded-full bg-white border shadow-sm text-[#F83002] font-medium">
        🚀 India's Smart Job Portal
      </span>
    </div>

    {/* Heading */}
    <div className="text-center mt-8">
      <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
        Search, Apply &
        <br />
        Get Your{" "}
        <span className="bg-gradient-to-r from-[#6A38C2] to-[#9D4EDD] bg-clip-text text-transparent">
          Dream Job
        </span>
      </h1>

      <p className="mt-6 max-w-2xl mx-auto text-gray-600 text-lg">
        Discover opportunities from top companies,
        connect with recruiters, and build the career
        you've always wanted.
      </p>
    </div>

    {/* Search Bar */}
    <div className="flex w-full md:w-[65%] mx-auto mt-10 bg-white border rounded-full shadow-xl overflow-hidden focus-within:shadow-2xl transition-all duration-300">
      <input
        type="text"
        placeholder="Search jobs, companies, skills..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchJobHandler();
          }
        }}
        className="flex-1 px-6 py-4 outline-none"
      />

      <Button
        onClick={searchJobHandler}
        className="rounded-none rounded-r-full bg-[#6A38C2] hover:bg-[#582db0] px-8"
      >
        <Search />
      </Button>
    </div>

    {/* Popular Searches */}
    <div className="flex flex-wrap justify-center gap-3 mt-6">
      {popularSearches.map((item, index) => (
        <button
          key={index}
          onClick={() => {
            dispatch(setSearchedQuery(item));
            navigate("/browse");
          }}
          className="px-4 py-2 bg-white border rounded-full text-sm hover:bg-[#6A38C2] hover:text-white hover:scale-105 transition-all duration-300"
        >
          {item}
        </button>
      ))}
    </div>

    {/* Features */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

      <div className="bg-white rounded-2xl border p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="text-4xl mb-3">⚡</div>
        <h3 className="text-xl font-bold">
          Fast Search
        </h3>
        <p className="text-gray-500 mt-2">
          Quickly find jobs that match your skills and interests.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-xl font-bold">
          Easy Apply
        </h3>
        <p className="text-gray-500 mt-2">
          Apply to opportunities in just a few clicks.
        </p>
      </div>

      <div className="bg-white rounded-2xl border p-6 text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="text-4xl mb-3">🔒</div>
        <h3 className="text-xl font-bold">
          Secure Platform
        </h3>
        <p className="text-gray-500 mt-2">
          Safe authentication and protected user accounts.
        </p>
      </div>

    </div>

  </div>
</section>


);
};

export default HeroSection;
