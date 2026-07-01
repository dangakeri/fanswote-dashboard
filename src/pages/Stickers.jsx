import { useState, useRef } from "react";
import {
  Sticker,
  Plus,
  Trash2,
  Loader2,
  X,
  ImagePlus,
  Upload,
} from "lucide-react";
import {
  useStickerPacks,
  useCreatePack,
  useDeletePack,
  useAddSticker,
  useDeleteSticker,
} from "../hooks/useStickers";
import { useToast } from "../context/ToastContext";

function ImagePicker({ file, onPick, label, aspect = "aspect-square" }) {
  const inputRef = useRef(null);
  const preview = file ? URL.createObjectURL(file) : null;
  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      className={`${aspect} w-full rounded-lg border-2 border-dashed border-border dark:border-d-border flex flex-col items-center justify-center gap-1.5 text-text-muted dark:text-d-text-muted hover:border-primary/40 hover:text-primary transition-colors overflow-hidden bg-page dark:bg-d-elevated`}
    >
      {preview ? (
        <img src={preview} alt="preview" className="w-full h-full object-cover" />
      ) : (
        <>
          <ImagePlus size={20} />
          <span className="text-[11px]">{label}</span>
        </>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onPick(e.target.files?.[0] || null)}
      />
    </button>
  );
}

function CreatePackModal({ open, onClose, onSave, pending }) {
  const [name, setName] = useState("");
  const [cover, setCover] = useState(null);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[15px] font-semibold text-text dark:text-d-text">New sticker pack</h3>
          <button onClick={onClose} className="p-1 rounded-md text-text-muted dark:text-d-text-muted hover:bg-hover dark:hover:bg-d-hover">
            <X size={16} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1.5">
              Pack name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Reactions"
              className="w-full px-3 py-2 rounded-lg text-sm bg-page dark:bg-d-elevated text-text dark:text-d-text placeholder-text-muted dark:placeholder-d-text-muted border border-border dark:border-d-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted dark:text-d-text-muted font-medium mb-1.5">
              Cover image
            </label>
            <div className="w-28">
              <ImagePicker file={cover} onPick={setCover} label="Cover" />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary dark:text-d-text-secondary border border-border dark:border-d-border hover:bg-hover dark:hover:bg-d-hover transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave({ name: name.trim(), cover })}
            disabled={pending || !name.trim() || !cover}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover shadow-sm shadow-primary/25 transition-colors disabled:opacity-50 flex items-center gap-1.5"
          >
            {pending && <Loader2 size={14} className="animate-spin" />}
            Create pack
          </button>
        </div>
      </div>
    </div>
  );
}

function PackCard({ pack, onDeletePack, onAddSticker, onDeleteSticker, addPendingId, deletePendingId }) {
  const [file, setFile] = useState(null);
  const stickers = pack.stickers || pack.items || [];
  const isAdding = addPendingId === pack.id;

  return (
    <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border overflow-hidden shadow-card dark:shadow-none">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60 dark:border-d-border/60">
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-page dark:bg-d-elevated shrink-0 flex items-center justify-center">
          {pack.cover_url || pack.cover ? (
            <img src={pack.cover_url || pack.cover} alt={pack.name} className="w-full h-full object-cover" />
          ) : (
            <Sticker size={18} className="text-text-muted dark:text-d-text-muted" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-text dark:text-d-text truncate">{pack.name || `Pack #${pack.id}`}</p>
          <p className="text-[11.5px] text-text-muted dark:text-d-text-muted">{stickers.length} stickers</p>
        </div>
        <button
          onClick={() => onDeletePack(pack)}
          disabled={deletePendingId === pack.id}
          className="p-2 rounded-lg text-text-muted dark:text-d-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors disabled:opacity-50"
          aria-label="Delete pack"
        >
          {deletePendingId === pack.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
        </button>
      </div>

      <div className="p-4">
        {stickers.length === 0 ? (
          <p className="text-[12px] text-text-muted dark:text-d-text-muted text-center py-4">No stickers yet</p>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {stickers.map((s) => (
              <div key={s.id} className="group relative aspect-square rounded-lg overflow-hidden bg-page dark:bg-d-elevated">
                <img src={s.image_url || s.image || s.url} alt={s.name || "sticker"} className="w-full h-full object-cover" />
                <button
                  onClick={() => onDeleteSticker(s.id)}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  aria-label="Delete sticker"
                >
                  <Trash2 size={15} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add sticker */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/60 dark:border-d-border/60">
          <div className="w-14 shrink-0">
            <ImagePicker file={file} onPick={setFile} label="Image" />
          </div>
          <button
            onClick={() => {
              onAddSticker(pack.id, file, () => setFile(null));
            }}
            disabled={!file || isAdding}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12.5px] font-medium text-white bg-primary hover:bg-primary-hover shadow-sm shadow-primary/25 transition-colors disabled:opacity-50"
          >
            {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Add sticker
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Stickers() {
  const [showCreate, setShowCreate] = useState(false);
  const toast = useToast();

  const { data: packs = [], isLoading } = useStickerPacks();
  const createPack = useCreatePack();
  const deletePack = useDeletePack();
  const addSticker = useAddSticker();
  const deleteSticker = useDeleteSticker();

  const handleCreate = ({ name, cover }) => {
    createPack.mutate(
      { name, cover },
      {
        onSuccess: () => {
          toast.success("Sticker pack created");
          setShowCreate(false);
        },
        onError: (err) => toast.error(err.message || "Failed to create pack"),
      }
    );
  };

  const handleDeletePack = (pack) => {
    if (!window.confirm(`Delete "${pack.name}" and all its stickers?`)) return;
    deletePack.mutate(pack.id, {
      onSuccess: () => toast.success("Pack deleted"),
      onError: (err) => toast.error(err.message || "Failed to delete pack"),
    });
  };

  const handleAddSticker = (packId, file, reset) => {
    if (!file) return;
    addSticker.mutate(
      { packId, payload: { image: file } },
      {
        onSuccess: () => {
          toast.success("Sticker added");
          reset();
        },
        onError: (err) => toast.error(err.message || "Failed to add sticker"),
      }
    );
  };

  const handleDeleteSticker = (id) => {
    deleteSticker.mutate(id, {
      onSuccess: () => toast.success("Sticker removed"),
      onError: (err) => toast.error(err.message || "Failed to remove sticker"),
    });
  };

  return (
    <div className="space-y-6">
      <CreatePackModal open={showCreate} onClose={() => setShowCreate(false)} onSave={handleCreate} pending={createPack.isPending} />

      <div className="flex items-end justify-between gap-4 flex-wrap border-b border-border/60 dark:border-d-border/60 pb-5">
        <div>
          <h1 className="text-[22px] font-extrabold text-text dark:text-d-text tracking-tight leading-tight">
            Stickers
          </h1>
          <p className="text-[12.5px] text-text-muted dark:text-d-text-muted mt-1">
            Manage sticker packs available in chat
          </p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-medium text-white bg-primary hover:bg-primary-hover shadow-sm shadow-primary/25 transition-colors"
        >
          <Plus size={15} />
          New pack
        </button>
      </div>

      {isLoading ? (
        <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border p-16 text-center">
          <Loader2 size={26} className="mx-auto text-primary animate-spin mb-3" />
          <p className="text-sm text-text-muted dark:text-d-text-muted">Loading sticker packs…</p>
        </div>
      ) : packs.length === 0 ? (
        <div className="bg-surface dark:bg-d-surface rounded-2xl border border-border/70 dark:border-d-border p-16 text-center">
          <Sticker size={28} className="mx-auto text-text-muted/20 dark:text-d-text-muted/20 mb-3" />
          <p className="text-sm text-text dark:text-d-text font-medium">No sticker packs yet</p>
          <p className="text-[12.5px] text-text-muted dark:text-d-text-muted mt-1">
            Create your first pack to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {packs.map((pack) => (
            <PackCard
              key={pack.id}
              pack={pack}
              onDeletePack={handleDeletePack}
              onAddSticker={handleAddSticker}
              onDeleteSticker={handleDeleteSticker}
              addPendingId={addSticker.isPending ? addSticker.variables?.packId : null}
              deletePendingId={deletePack.isPending ? deletePack.variables : null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
