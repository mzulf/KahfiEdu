import { Container, Grid, Pagination, Stack, Typography } from "@mui/material";
import BlogList from "../../components/Guest/blog/BlogList";
import FilterBlog from "../../components/Guest/blog/FilterBlog";
import { useEffect, useState } from "react";
import blogService from "../../services/blogService";
import { useLoading } from "../../hooks/useLoading";
import useAlert from "../../hooks/useAlert";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [filters, setFilters] = useState({ search: "", tags: [] });
  const [availableTags, setAvailableTags] = useState([]);
  const { showLoading, hideLoading } = useLoading();
  const { showAlert } = useAlert();

  // Fetch blogs with current filters & pagination
  const fetchBlogs = async () => {
    showLoading();
    try {
      const res = await blogService.getBlogs({
        page: page + 1,
        limit: 5,
        status: "active",
        search: filters.search,
        tags: filters.tags.join(","),
        isFeatured: null,
        isPublish: true,
      });
      if (res.success) {
        setBlogs(res.blogs);
        setTotalRows(res.meta?.total || 0);
      }
    } catch (error) {
      showAlert(error.message, "error");
    } finally {
      hideLoading();
    }
  };

  // Fetch available tags once
  const fetchTags = async () => {
    try {
      const res = await blogService.getTags();
      if (res.success) {
        setAvailableTags(res.tags || []);
      }
    } catch (error) {
      console.error("Gagal mengambil tags:", error);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [page, filters]);

  // Pagination page change handler
  const handlePageChange = (event, newPage) => {
    setPage(newPage - 1); // zero-based indexing
  };

  // Handler from FilterBlog to update filters and reset page
  const handleSearch = (newFilters) => {
    // Cek apakah filters benar-benar berubah
    const isSameSearch = filters.search === newFilters.search;
    const isSameTags = JSON.stringify(filters.tags) === JSON.stringify(newFilters.tags);

    if (!isSameSearch || !isSameTags) {
      setFilters(newFilters);
      setPage(0); // reset page hanya jika filter berubah
    }
  };

  const totalPages = Math.ceil(totalRows / 5);

  return (
    <div className="px-30">
      <div className="flex gap-2 mt-4 items-center justify-start mb-6">
        <Typography component="p" fontSize={28} fontWeight={500}>
          Tambah Wawasan
        </Typography>
        <Typography component="p" fontSize={18} fontWeight={400}>
          {blogs.length} Hasil
        </Typography>
      </div>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 9 }}>
          <Stack spacing={2}>
            {blogs.length === 0 ? (
              <Typography variant="body1" fontWeight="semibold" textAlign="left">
                Tidak ada blog yang ditemukan.
              </Typography>
            ) : (
              <>
                <BlogList blogs={blogs} />
                <Pagination
                  className="flex justify-center"
                  shape="rounded"
                  count={totalPages}
                  page={page + 1}
                  onChange={handlePageChange}
                  color="primary"
                  siblingCount={0}
                  boundaryCount={2}
                />
              </>
            )}

          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <FilterBlog
            onSearch={handleSearch}
            availableTags={availableTags}
            initialSearch={filters.search}
            initialSelectedTags={filters.tags}
          />
        </Grid>
      </Grid>
    </div>
  );
}
