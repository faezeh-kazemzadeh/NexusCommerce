import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTags, deleteTag } from "../services/tag.service";
import TagsForm from "../components/TagsForm";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../../core/components/common/Pagination";
import { useDebounce } from "../../users/hooks/useDebounce";
const Tags = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const queryClient = useQueryClient();

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useQuery({
    queryKey: ["tags", page, debouncedSearch],
    queryFn: () => getTags({ page, search: debouncedSearch, limit: 10 }),
    placeholderData: (previousData) => previousData,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => queryClient.invalidateQueries(["tags"]),
    onError: (err) => alert(err.message),
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-800">Tags Management</h1>
        <button
          onClick={() => {
            setSelectedTag(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100"
        >
          + Add New Tag
        </button>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tags..."
          className="w-full max-w-sm px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
        />
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 text-slate-400 font-black uppercase text-xs">
                Name
              </th>
              <th className="p-5 text-slate-400 font-black uppercase text-xs">
                Usage Count
              </th>
              <th className="p-5 text-slate-400 font-black uppercase text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {!isLoading && data?.tags?.length === 0 ? (
              <tr>
                <td colSpan="3" className="p-20 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="text-6xl text-slate-200">🔍</div>
                    <p className="text-slate-500 font-bold text-lg">
                      No tags found for{" "}
                      <span className="text-blue-600">"{searchTerm}"</span>
                    </p>
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-sm text-blue-500 hover:underline font-medium"
                    >
                      Clear search and show all tags
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              data?.tags?.map((tag) => (
                <tr
                  key={tag._id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="p-5 font-bold text-slate-700">{tag.name}</td>
                  <td className="p-5 text-slate-500 font-medium">
                    {tag.usageCount}
                  </td>
                  <td className="p-5 flex justify-center space-x-4">
                    <FaEdit
                      className="text-blue-500 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => {
                        setSelectedTag(tag);
                        setIsModalOpen(true);
                      }}
                    />
                    <FaTrash
                      className="text-rose-500 cursor-pointer hover:scale-110 transition-transform"
                      onClick={() => {
                        if (window.confirm("Delete this tag?"))
                          deleteMutation.mutate(tag._id);
                      }}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Simple Pagination */}
      <Pagination
        page={page}
        totalPages={data?.pagination?.totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {isModalOpen && (
        <TagsForm tag={selectedTag} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default Tags;
