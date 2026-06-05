import  { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar,AvatarFallback, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, Eye, MoreHorizontal } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from "axios";
import { toast } from "sonner";
import { JOB_API_END_POINT } from "@/utils/constant";
const AdminJobsTable = () => { 
    const {allAdminJobs, searchJobByText} = useSelector(store=>store.job);

    const [filterJobs, setFilterJobs] = useState(allAdminJobs);
    const navigate = useNavigate();
    const deleteJobHandler = async (id) => {
    try {
        const res = await axios.delete(
            `${JOB_API_END_POINT}/delete/${id}`,
            {
                withCredentials: true
            }
        );

        if (res.data.success) {
            toast.success(res.data.message);

            // refresh page
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Delete failed");
    }
};
const toggleStatusHandler = async (id) => {
    try {
        const res = await axios.put(
            `${JOB_API_END_POINT}/toggle-status/${id}`,
            {},
            {
                withCredentials: true
            }
        );

        if (res.data.success) {
            toast.success(res.data.message);

            // refresh page
            window.location.reload();
        }
    } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message || "Status update failed");
    }
};

    useEffect(()=>{ 
        console.log('called');
        const filteredJobs = allAdminJobs.filter((job)=>{
            if(!searchJobByText){
                return true;
            }
            return job?.title?.toLowerCase().includes(searchJobByText.toLowerCase()) || job?.company?.name.toLowerCase().includes(searchJobByText.toLowerCase());

        });
        setFilterJobs(filteredJobs);
    },[allAdminJobs,searchJobByText])
    return (
        <div>
            <Table>
                <TableCaption>A list of your recent  posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        filterJobs?.map((job) => (
                            <TableRow key={job._id}>

                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage
                                                src={job?.company?.logo}
                                                alt={job?.company?.name}
                                            />
                                            <AvatarFallback>
                                                {job?.company?.name?.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span>{job?.company?.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{job?.title}</TableCell>

                                        <TableCell>
                                            <span
                                                className={`px-2 py-1 rounded text-white ${
                                                    job?.status === "Open"
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            >
                                                {job?.status}
                                            </span>
                                        </TableCell>

                                        <TableCell>
                                           {job?.createdAt?.split("T")[0]}
                                        </TableCell>
                                <TableCell className="text-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-40">
                                            <div
                                                onClick={() => navigate(`/admin/jobs/${job._id}`)}
                                                className='flex items-center gap-2 w-fit cursor-pointer'
                                            >
                                                <Edit2 className='w-4' />
                                                <span>Edit</span>
                                            </div>

                                            <div
                                                onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                                                className='flex items-center w-fit gap-2 cursor-pointer mt-2'
                                            >
                                                <Eye className='w-4' />
                                                <span>Applicants</span>
                                            </div>

                                           
                                                <div onClick={() => toggleStatusHandler(job._id)}
                                                className='cursor-pointer mt-2'
                                            >
                                                {job?.status === "Open"
                                                    ? "🔒 Close Job"
                                                    : "🔓 Open Job"}
                                            </div>

                                            <div
                                                onClick={() => deleteJobHandler(job._id)}
                                                className='cursor-pointer mt-2 text-red-500'
                                            >
                                                🗑 Delete Job
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>

                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable