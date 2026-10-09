import { Job } from "../models/job.model.js";

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Somethin is missing.",
                success: false
            })
        };
        const job = await Job.create({
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });
        return res.status(201).json({
            message: "New job created successfully.",
            job,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";

        const jobs = await Job.aggregate([
            {
                $lookup: {
                    from: "companies",
                    localField: "company",
                    foreignField: "_id",
                    as: "company"
                }
            },
            {
                $unwind: {
                    path: "$company",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    $or: [
                        { title: { $regex: keyword, $options: "i" } },
                        { description: { $regex: keyword, $options: "i" } },
                        { "company.name": { $regex: keyword, $options: "i" } }
                    ]
                }
            },
            {
                $sort: { createdAt: -1 }
            }
        ]);

        return res.status(200).json({
            jobs,
            success: true
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        return res.status(500).json({
            message: "Failed to fetch jobs",
            success: false
        });
    }
};

export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        const job = await Job.findById(jobId)
            .populate("company")
            .populate("applications");

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.error("Error fetching job:", error);

        return res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};
// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate({
            path:'company',
            createdAt:-1
        });
        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateJob = async (req, res) => {
    try {
        const {
            title,
            description,
            requirements,
            salary,
            location,
            experienceLevel,
            jobType,
            position
        } = req.body;

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                requirements: typeof requirements === "string"
                    ? requirements.split(",").map(req => req.trim())
                    : requirements,
                salary,
                location,
                experienceLevel,
                jobType,
                position
            },
            { new: true }
        );

        if (!updatedJob) {
            return res.status(404).json({
                success: false,
                message: "Job not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Job updated successfully",
            job: updatedJob
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to update job"
        });
    }
}
export const deleteJob = async (req,res) => {
    try {

        const jobId = req.params.id;

        const job = await Job.findByIdAndDelete(jobId);

        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        }

        return res.status(200).json({
            message:"Job deleted successfully",
            success:true
        })

    } catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Internal server error"
    });
}
}
export const toggleJobStatus = async (req,res) => {

    try {

        const jobId = req.params.id;

        const job = await Job.findById(jobId);

        if(!job){
            return res.status(404).json({
                message:"Job not found",
                success:false
            })
        }

        job.status =
            job.status === "Open"
            ? "Closed"
            : "Open";

        await job.save();

        return res.status(200).json({
            message:`Job ${job.status}`,
            success:true
        })

    } catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:"Internal server error"
    });
}
};
