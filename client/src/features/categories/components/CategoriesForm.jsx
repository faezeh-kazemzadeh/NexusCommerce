import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, updateCategory } from "../services/category.service";

const CategoriesForm = ({ category, onClose, allCats }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
  });

  const getDescendants = (categories, parentId) => {
    let result = [];

    const findChildren = (id) => {
      categories.forEach((cat) => {
        if (cat.parent === id || cat.parent?._id === id) {
          result.push(cat._id);
          findChildren(cat._id);
        }
      });
    };

    findChildren(parentId);
    return result;
  };
  const forbiddenIds = category
    ? [category._id, ...getDescendants(allCats?.categories || [], category._id)]
    : [];

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || "",
        parent: category.parent?._id || category.parent || "",
      });
    }
  }, [category]);

  const mutation = useMutation({
    mutationFn: category ? updateCategory : createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);

      queryClient.setQueryData(["all-categories"], (oldData) => {
        if (!oldData) return oldData;

        if (!category) {
          return {
            ...oldData,
            categories: [
              ...oldData.categories,
              {
                ...formData,
                _id: Math.random().toString(),
              },
            ],
          };
        }

        return {
          ...oldData,
          categories: oldData.categories.map((c) =>
            c._id === category._id ? { ...c, ...formData } : c,
          ),
        };
      });

      setTimeout(onClose, 1500);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      parent: formData.parent === "" ? null : formData.parent,
    };

    if (category) {
      mutation.mutate({ id: category._id, categoryData: payload });
    } else {
      mutation.mutate(payload);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2.5rem] p-10 w-full max-w-md shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-black text-slate-800 text-center mb-8">
          {category ? "Edit Category" : "Create New Category"}
        </h2>

        {mutation.isError && (
          <div className="mb-6 p-4 bg-rose-50 border-r-4 border-rose-500 text-rose-700 text-sm rounded-xl font-bold">
            {mutation.error.message || "Failed to save category"}
          </div>
        )}

        {mutation.isSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700 text-sm rounded-xl font-bold">
            Action completed successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Category Name"
            disabled={mutation.isPending || mutation.isSuccess}
            required
          />

          <select
            className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            value={formData.parent}
            onChange={(e) =>
              setFormData({ ...formData, parent: e.target.value })
            }
            disabled={mutation.isPending || mutation.isSuccess}
          >
            <option value="">No Parent (Root)</option>
            {allCats?.categories
              ?.filter((c) => !forbiddenIds.includes(c._id))
              .map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>

          <textarea
            className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description (Optional)"
            rows="3"
            disabled={mutation.isPending || mutation.isSuccess}
          />

          <div className="flex justify-end space-x-3 mt-10">
            {!mutation.isSuccess ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="px-8 py-2.5 bg-indigo-600 rounded-xl font-bold text-white shadow-lg"
                >
                  {mutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <div className="text-emerald-500 font-black animate-bounce text-center w-full">
                Done!
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriesForm;
