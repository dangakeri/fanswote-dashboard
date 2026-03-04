import { useState } from "react";
import { Search, Image, Video, Flag, Eye, Trash2, CheckCircle, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useContent } from "../hooks/useContent";
import { contentData as mockContent } from "../data/mockData";

const typeIcons = { photo_set: Image, video: Video };

const statusBadge = {
  published: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10",
  under_review: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10",
  removed: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10",
};

export default function ContentPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const { data: contentData = mockContent } = useContent();

  const filtered = contentData.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.creator.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "flagged" ? item.flagged : item.status === statusFilter);
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted dark:text-d-text-muted" />
          <input
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg text-sm bg-surface dark:bg-d-surface text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-surface dark:bg-d-surface rounded-lg border border-border dark:border-d-border p-0.5">
            {["all", "video", "photo_set"].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  typeFilter === type
                    ? "bg-primary text-white"
                    : "text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text"
                }`}
              >
                {type === "all" ? "All" : type === "photo_set" ? "Photos" : "Videos"}
              </button>
            ))}
          </div>
          <div className="flex bg-surface dark:bg-d-surface rounded-lg border border-border dark:border-d-border p-0.5">
            {["all", "published", "under_review", "flagged"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  statusFilter === s
                    ? "bg-primary text-white"
                    : "text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text"
                }`}
              >
                {s === "all" ? "All" : s === "under_review" ? "Review" : s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((item) => {
          const TypeIcon = typeIcons[item.type] || Video;
          return (
            <div
              key={item.id}
              className="bg-surface dark:bg-d-surface rounded-xl border border-border dark:border-d-border overflow-hidden group hover:border-primary/30 transition-colors"
            >
              <div className="h-40 bg-page dark:bg-d-elevated flex items-center justify-center relative">
                <TypeIcon size={32} strokeWidth={1.2} className="text-text-muted/20 dark:text-d-text-muted/20" />
                {item.flagged && (
                  <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center">
                    <Flag size={13} className="text-red-500" />
                  </div>
                )}
                <span className={`absolute top-3 left-3 text-[10px] px-2.5 py-0.5 rounded-full font-medium capitalize ${statusBadge[item.status]}`}>
                  {item.status === "under_review" ? "Under Review" : item.status}
                </span>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-text dark:text-d-text text-[13px] truncate">{item.title}</h4>
                <p className="text-[11px] text-text-muted dark:text-d-text-muted mt-1 mb-3">
                  {item.creator} &middot; {item.date}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-border dark:border-d-border">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-primary">{item.price}</span>
                    <span className="flex items-center gap-1 text-[11px] text-text-muted dark:text-d-text-muted">
                      <Heart size={11} /> {item.likes.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 rounded-md text-text-muted dark:text-d-text-muted hover:text-text dark:hover:text-d-text hover:bg-hover dark:hover:bg-d-hover transition-colors">
                      <Eye size={14} />
                    </button>
                    {item.flagged && (
                      <button className="p-1.5 rounded-md text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors">
                        <CheckCircle size={14} />
                      </button>
                    )}
                    <button className="p-1.5 rounded-md text-text-muted dark:text-d-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-text-muted dark:text-d-text-muted">
          Showing <span className="font-medium text-text dark:text-d-text">{filtered.length}</span> of{" "}
          <span className="font-medium text-text dark:text-d-text">{contentData.length}</span> items
        </p>
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-md text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button className="w-7 h-7 rounded-md bg-primary text-white text-xs font-bold flex items-center justify-center">1</button>
          <button className="p-1.5 rounded-md text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
