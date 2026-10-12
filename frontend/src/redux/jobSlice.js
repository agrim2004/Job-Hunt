import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",

    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        searchedQuery: "",
        selectedSalary: "",
        selectedLocation: "",
        selectedRole: ""
    },

    reducers: {
        setAllJobs: (state, action) => {
            state.allJobs = action.payload;
        },

        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },

        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },

        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },

        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },

        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
        },

        setSelectedSalary: (state, action) => {
            state.selectedSalary = action.payload;
        },

        setSelectedLocation: (state, action) => {
            state.selectedLocation = action.payload;
        },

        setSelectedRole: (state, action) => {
            state.selectedRole = action.payload;
        }
    }
});

export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setSearchedQuery,
    setSelectedSalary,
    setSelectedLocation,
    setSelectedRole
} = jobSlice.actions;

export default jobSlice.reducer;
