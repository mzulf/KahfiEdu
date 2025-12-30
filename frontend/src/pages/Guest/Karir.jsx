import { useEffect, useState } from "react";
import HeroKarir from "../../components/Guest/karir/HeroKarir";
import ListKarir from "../../components/Guest/karir/ListKarir";
import jobService from "../../services/jobService";
import useAlert from "../../hooks/useAlert";
import { useLoading } from "../../hooks/useLoading";

export default function Karir() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const { showLoading, hideLoading } = useLoading();
    const { showAlert } = useAlert();

    // debounce pencarian
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    const fetchJobs = async () => {
        showLoading();
        try {
            const response = await jobService.getJobs({
                page: 1,
                limit: 1000,
                status: "active",
                search: debouncedSearch,
            });

            if (response.success) {
                setJobs(response.jobs);
                console.log("Jobs fetched successfully:", response.jobs);
            }
        } catch (error) {
            showAlert(error.message || "Gagal mengambil data pekerjaan", "error");
        } finally {
            hideLoading();
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [debouncedSearch]);

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };


    return (
        <>
            <HeroKarir />
            <ListKarir jobs={jobs} handleSearchChange={handleSearchChange} />
        </>
    );
}
