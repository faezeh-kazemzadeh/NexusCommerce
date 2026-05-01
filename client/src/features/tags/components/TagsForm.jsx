import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTag, updateTag } from "../services/tag.service";

const TagsForm = ({ tag, onClose }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", description: "" });

  useEffect(() => {
    if (tag) {
      setFormData({ name: tag.name, description: tag.description || "" });
    }
  }, [tag]);

  const mutation = useMutation({
    mutationFn: tag ? updateTag : createTag,
    onSuccess: () => {
      queryClient.invalidateQueries(["tags"]);
      setTimeout(onClose, 1500);
    },
  });

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
          {tag ? "Edit Tag" : "Create New Tag"}
        </h2>

        {mutation.isError && (
          <div className="mb-6 p-4 bg-rose-50 border-r-4 border-rose-500 text-rose-700 text-sm rounded-xl font-bold">
            {mutation.error.message || "Failed to save tag"}
          </div>
        )}

        {mutation.isSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border-r-4 border-emerald-500 text-emerald-700 text-sm rounded-xl font-bold">
            Action completed successfully!
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (tag) {
              // Editing:
              mutation.mutate({
                id: tag._id,
                tagData: { ...formData },
              });
            } else {
              // Creating:
              mutation.mutate(formData);
            }
          }}
          className="space-y-5"
        >
          <input
            className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Tag Name"
            disabled={mutation.isPending || mutation.isSuccess}
            required
          />
          <textarea
            className="w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Description"
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
                  className="px-8 py-2.5 bg-blue-600 rounded-xl font-bold text-white"
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

export default TagsForm;
