import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCategories, deleteCategory } from "../services/category.service";
import CategoriesForm from "../components/CategoriesForm";
import { FaEdit, FaTrash } from "react-icons/fa";
import Pagination from "../../../core/components/common/Pagination";

const Categories = () => {
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["categories", page],
    queryFn: () => getCategories({ page, limit: 10 }),
    placeholderData: (previousData) => previousData,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const { data: allCats } = useQuery({
    queryKey: ["all-categories"],
    queryFn: () => getCategories({ all: true }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => queryClient.invalidateQueries(["categories"]),
    onError: (err) => alert(err.message),
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-800">Categories</h1>
        <button
          onClick={() => {
            setSelectedCategory(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg"
        >
          + Add Category
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-5 text-slate-400 font-black uppercase text-xs">
                Name
              </th>
              <th className="p-5 text-slate-400 font-black uppercase text-xs">
                Parent
              </th>
              <th className="p-5 text-slate-400 font-black uppercase text-xs">
                Usage
              </th>
              <th className="p-5 text-slate-400 font-black uppercase text-xs text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data?.categories?.map((cat) => (
              <tr
                key={cat._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="p-5 font-bold text-slate-700">{cat.name}</td>
                <td className="p-5">
                  {cat.parent ? (
                    <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-sm font-bold">
                      {cat.parent.name}
                    </span>
                  ) : (
                    <span className="text-slate-300">Root</span>
                  )}
                </td>
                <td className="p-5 text-slate-500 font-medium">
                  {cat.usageCount}
                </td>
                <td className="p-5 flex justify-center space-x-4">
                  <FaEdit
                    className="text-indigo-500 cursor-pointer hover:scale-110"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsModalOpen(true);
                    }}
                  />
                  <FaTrash
                    className="text-rose-500 cursor-pointer hover:scale-110"
                    onClick={() => {
                      if (window.confirm("Delete this category?"))
                        deleteMutation.mutate(cat._id);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        totalPages={data?.pagination?.totalPages}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {isModalOpen && (
        <CategoriesForm
          category={selectedCategory}
          allCats={allCats}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Categories;
