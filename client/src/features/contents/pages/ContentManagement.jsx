import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getContents } from "../services/content.service";
import { getCategories } from "../../categories/services/category.service";
import { useDebounce } from "../../../core/hooks/useDebounce";
import Pagination from "../../../core/components/common/Pagination";
import ContentForm from "../components/ContentForm";
function ContentManagement() {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: [
      "contents",
      page,
      debouncedSearch,
      typeFilter,
      statusFilter,
      categoryFilter,
    ],
    queryFn: () =>
      getContents({
        page,
        limit: 7,
        search: debouncedSearch,
        type: typeFilter,
        status: statusFilter,
        category: categoryFilter,
      }),
    placeholderData: (previousData) => previousData,
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ["categories", "all"],
    queryFn: () => getCategories({ all: true }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const categories = categoriesResponse?.categories || [];
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-800 mb-8">
          Content Management
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg mb-6"
        >
          + Create New Content
        </button>
      </div>
      {/* Filters and search input */}
      <div className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Search contents..."
          className="w-full max-w-sm px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
        <title>Type:</title>
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Types</option>
          <option value="article">Article</option>
          <option value="video">Video</option>
          <option value="podcast">Podcast</option>
          <option value="gallery">Gallery</option>
          <option value="review">Review</option>
          <option value="news">News</option>
        </select>

        <title>Status:</title>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>

        <title>Category:</title>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories?.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content list table */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden min-h-[500px]">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 text-slate-400 font-black uppercase text-xs">
                Title
              </th>
              <th className="p-5 text-slate-400 font-black uppercase text-xs">
                Type
              </th>
              <th className="p-5 text-slate-400 font-black uppercase text-xs">
                Status
              </th>
              <th className="p-5 text-slate-400 font-black uppercase text-xs">
                Category
              </th>
              <th className="p-5 text-slate-400 font-black uppercase text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.contents.map((content) => (
              <tr key={content._id} className="border-b border-slate-100">
                <td className=" p-5 font-bold text-slate-700">
                  {content.title}
                </td>
                <td className="p-5 text-slate-500">{content.type}</td>
                <td className="p-5 text-slate-500">{content.status}</td>
                <td className="p-5 text-slate-500">
                  {content.category ? content.category.name : "Uncategorized"}
                </td>
                <td className="p-5 flex justify-center space-x-4">
                  {/* Action buttons for edit/delete can be added here */}
                  <button className="text-indigo-500 hover:underline">
                    Edit
                  </button>
                  <button className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data?.pagination?.pages > 1 && (
        <Pagination
          page={page}
          totalPages={data?.pagination?.pages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}
      {isModalOpen && (
        <ContentForm
          categories={categories}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default ContentManagement;
