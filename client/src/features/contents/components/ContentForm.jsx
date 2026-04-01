import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createContent } from "../services/content.service";

const ContentForm = ({ onClose, categories }) => {
  const queryClient = useQueryClient();
  const [step, setStep] = useState(0);

  const [proInput, setProInput] = useState("");
  const [conInput, setConInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    type: "article",
    category: "",
    status: "draft",
    cover: null,
    mainMediaFile: null,
    media: [],
    externalUrl: "",
    rating: "",
    source: "",
    pros: [],
    cons: [],
  });

  const mutation = useMutation({
    mutationFn: ({ data, type }) => createContent(data, type),
    onSuccess: () => {
      queryClient.invalidateQueries(["contents"]);
      setTimeout(onClose, 1500);
    },
  });

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addListItem = (type, value) => {
    if (!value.trim()) return;
    setFormData((prev) => ({
      ...prev,
      [type]: [...prev[type], value.trim()],
    }));
    if (type === "pros") setProInput("");
    else setConInput("");
  };

  const removeItem = (type, index) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (isStepValid()) setStep((s) => s + 1);
  };

  const prevStep = () => {
    setStep((s) => (s > 0 ? s - 1 : 0));
  };

  const isStepValid = () => {
    switch (step) {
      case 0:
        return formData.category && formData.status;
      case 1:
        return formData.title.trim() && formData.body.trim();
      case 2:
        if (!formData.cover) return false;
        if (["video", "podcast"].includes(formData.type)) {
          return formData.mainMediaFile || formData.externalUrl.trim();
        }
        if (formData.type === "gallery") {
          return formData.media && formData.media.length > 0;
        }
        return true;
      case 3:
        if (formData.type === "review") return formData.rating;
        if (formData.type === "news") return formData.source.trim();
        return true;
      default:
        return false;
    }
  };

  const handleSubmit = () => {
    if (!isStepValid()) return;

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "media") {
        formData.media.forEach((file) => data.append("media", file));
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach((item) => data.append(`${key}[]`, item));
      } else if (formData[key] !== null && formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    mutation.mutate({ data, type: formData.type });
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">
                  Type *
                </label>
                <select
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                >
                  <option value="article">Article</option>
                  <option value="gallery">Gallery</option>
                  <option value="video">Video</option>
                  <option value="podcast">Podcast</option>
                  <option value="news">News</option>
                  <option value="review">Review</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">
                  Status *
                </label>
                <select
                  className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.status}
                  onChange={(e) => handleChange("status", e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700">
                Category *
              </label>
              <select
                className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <input
              className="w-full p-3 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Title..."
            />
            <textarea
              className="w-full p-3 border border-slate-200 rounded-xl min-h-[150px] outline-none focus:ring-2 focus:ring-indigo-500"
              value={formData.body}
              onChange={(e) => handleChange("body", e.target.value)}
              placeholder="Body content..."
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">
                Cover Image *
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleChange("cover", e.target.files[0])}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-indigo-50 file:text-indigo-700"
              />
            </div>

            {formData.type === "gallery" && (
              <div className="mt-4 p-4 bg-indigo-50/30 rounded-2xl border border-dashed border-indigo-200">
                <label className="block text-sm font-bold text-indigo-700 mb-2">
                  Gallery Images *
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    handleChange("media", Array.from(e.target.files))
                  }
                  className="w-full text-sm"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  {formData.media.length} images selected
                </p>
              </div>
            )}

            {["video", "podcast"].includes(formData.type) && (
              <div className="space-y-3 mt-4">
                <input
                  type="file"
                  accept={formData.type === "video" ? "video/*" : "audio/*"}
                  onChange={(e) =>
                    handleChange("mainMediaFile", e.target.files[0])
                  }
                  disabled={!!formData.externalUrl}
                  className="w-full text-sm"
                />
                <div className="text-center text-[10px] font-bold text-slate-300">
                  OR
                </div>
                <input
                  className="w-full p-3 border border-slate-200 rounded-xl text-sm"
                  placeholder="External URL (Youtube, SoundCloud...)"
                  value={formData.externalUrl}
                  disabled={!!formData.mainMediaFile}
                  onChange={(e) => handleChange("externalUrl", e.target.value)}
                />
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {formData.type === "review" && (
              <>
                <div>
                  <label className="block text-sm font-bold mb-1 text-slate-700">
                    Rating (1-5) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="w-full p-3 border border-slate-200 rounded-xl"
                    value={formData.rating}
                    onChange={(e) => handleChange("rating", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-emerald-600">
                    Pros
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 p-2 border border-slate-200 rounded-lg text-sm"
                      value={proInput}
                      onChange={(e) => setProInput(e.target.value)}
                      placeholder="Add pro..."
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addListItem("pros", proInput))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => addListItem("pros", proInput)}
                      className="bg-emerald-500 text-white px-3 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.pros.map((p, i) => (
                      <span
                        key={i}
                        className="bg-emerald-50 text-emerald-700 text-[10px] px-2 py-1 rounded-md flex items-center gap-1"
                      >
                        {p}{" "}
                        <button
                          type="button"
                          onClick={() => removeItem("pros", i)}
                          className="text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-red-600">
                    Cons
                  </label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 p-2 border border-slate-200 rounded-lg text-sm"
                      value={conInput}
                      onChange={(e) => setConInput(e.target.value)}
                      placeholder="Add con..."
                      onKeyDown={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), addListItem("cons", conInput))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => addListItem("cons", conInput)}
                      className="bg-red-500 text-white px-3 rounded-lg"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.cons.map((c, i) => (
                      <span
                        key={i}
                        className="bg-red-50 text-red-700 text-[10px] px-2 py-1 rounded-md flex items-center gap-1"
                      >
                        {c}{" "}
                        <button
                          type="button"
                          onClick={() => removeItem("cons", i)}
                          className="text-red-400"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
            {formData.type === "news" && (
              <div>
                <label className="block text-sm font-bold mb-2 text-slate-700">
                  News Source *
                </label>
                <input
                  className="w-full p-3 border border-slate-200 rounded-xl"
                  value={formData.source}
                  onChange={(e) => handleChange("source", e.target.value)}
                  placeholder="e.g. BBC News"
                />
              </div>
            )}
            {!["review", "news"].includes(formData.type) && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-slate-500 font-bold">Ready to publish!</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-black text-slate-800">
            New {formData.type}
          </h2>
          <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">
            Step {step + 1} of 4
          </span>
        </div>

        {mutation.isError && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-bold">
            {mutation.error?.response?.data?.message || "Server error"}
          </div>
        )}
        {mutation.isSuccess && (
          <div className="p-3 mb-4 bg-emerald-50 text-emerald-600 rounded-xl text-center font-bold">
            Content Saved!
          </div>
        )}

        <div className="min-h-[300px]">{renderStep()}</div>

        <div className="flex justify-between mt-10">
          <button
            type="button"
            className={`font-bold transition-all ${step === 0 ? "invisible" : "text-slate-400 hover:text-slate-600"}`}
            onClick={prevStep}
          >
            Back
          </button>

          {step < 3 ? (
            <button
              type="button"
              disabled={!isStepValid()}
              className={`px-8 py-2 rounded-xl font-bold transition-all ${isStepValid() ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
              onClick={nextStep}
            >
              Next Step
            </button>
          ) : (
            <button
              type="button"
              disabled={mutation.isPending || !isStepValid()}
              className={`px-8 py-2 rounded-xl font-bold transition-all ${isStepValid() && !mutation.isPending ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
              onClick={handleSubmit}
            >
              {mutation.isPending ? "Saving..." : "Publish Now"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentForm;
