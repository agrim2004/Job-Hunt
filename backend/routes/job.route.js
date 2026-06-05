import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
    postJob,
    getAllJobs,
    getAdminJobs,
    getJobById,
    deleteJob,
    toggleJobStatus,
    updateJob,
} from "../controllers/job.controller.js";

const router = express.Router();
router.delete(
    "/delete/:id",
    isAuthenticated,
    deleteJob
);

router.put(
    "/toggle-status/:id",
    isAuthenticated,
    toggleJobStatus
);

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(getJobById);
router.route("/update/:id").put(isAuthenticated, updateJob);

export default router;
