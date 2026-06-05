import { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const JobSetup = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    experienceLevel: "",
    jobType: "",
    position: ""
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const getSingleJob = async () => {
    
    try {
      const res = await axios.get(
        `${JOB_API_END_POINT}/get/${params.id}`,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const job = res.data.job;

        setInput({
          title: job.title || "",
          description: job.description || "",
          requirements: Array.isArray(job.requirements)
            ? job.requirements.join(", ")
            : job.requirements || "",
          salary: job.salary || "",
          location: job.location || "",
          experienceLevel: job.experienceLevel || "",
          jobType: job.jobType || "",
          position: job.position || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getSingleJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.put(
        `${JOB_API_END_POINT}/update/${params.id}`,
        input,
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success("Job updated successfully");
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-5 mb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/jobs")}
            >
              <ArrowLeft />
              Back
            </Button>

            <h1 className="font-bold text-2xl">
              Edit Job
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Job Title</Label>
              <Input
                name="title"
                value={input.title}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Salary</Label>
              <Input
                name="salary"
                value={input.salary}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                name="location"
                value={input.location}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Position</Label>
              <Input
                name="position"
                value={input.position}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Experience Level</Label>
              <Input
                name="experienceLevel"
                value={input.experienceLevel}
                onChange={changeEventHandler}
              />
            </div>

            <div>
              <Label>Job Type</Label>
              <Input
                name="jobType"
                value={input.jobType}
                onChange={changeEventHandler}
              />
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <Input
                name="description"
                value={input.description}
                onChange={changeEventHandler}
              />
            </div>

            <div className="col-span-2">
              <Label>Requirements</Label>
              <Input
                name="requirements"
                value={input.requirements}
                onChange={changeEventHandler}
              />
            </div>
          </div>

          {loading ? (
            <Button className="w-full mt-5">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </Button>
          ) : (
            <Button type="submit" className="w-full mt-5">
              Update Job
            </Button>
          )}
        </form>
      </div>
    </>
  );
};

export default JobSetup;