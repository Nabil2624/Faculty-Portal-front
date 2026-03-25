import { Tag, Plus, Pencil, Trash2 } from "lucide-react";

export default function LogsCategoryPanel({
  categories,
  onAdd,
  onEdit,
  onDelete,
  actionCountForCategory,
  t,
}) {
  return (
    <div className="rounded-2xl border border-[#19355a]/20 bg-white shadow-sm overflow-hidden">
      {/* Panel header */}
      <div
        className="bg-[#19355a] flex items-center justify-between"
        style={{
          padding: "clamp(0.7rem, 1.3vw, 1.3rem) clamp(0.9rem, 1.6vw, 1.6rem)",
        }}
      >
        <div className="flex items-center gap-2">
          <Tag
            className="text-[#b38e19]"
            style={{
              width: "clamp(0.9rem, 1.3vw, 1.4rem)",
              height: "clamp(0.9rem, 1.3vw, 1.4rem)",
            }}
          />
          <h2
            className="font-semibold text-white"
            style={{ fontSize: "clamp(0.8rem, 1.2vw, 1.25rem)" }}
          >
            {t("categories.title")}
          </h2>
          <span
            className="bg-white/20 text-white rounded-full font-medium"
            style={{
              padding: "1px clamp(0.4rem, 0.7vw, 0.7rem)",
              fontSize: "clamp(0.6rem, 0.8vw, 0.85rem)",
            }}
          >
            {categories.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1 bg-[#b38e19] hover:bg-[#b38e19]/90 text-white rounded-lg transition font-medium"
          style={{
            padding:
              "clamp(0.3rem, 0.55vw, 0.55rem) clamp(0.65rem, 1.1vw, 1.1rem)",
            fontSize: "clamp(0.6rem, 0.85vw, 0.9rem)",
          }}
        >
          <Plus
            style={{
              width: "clamp(0.7rem, 1vw, 1rem)",
              height: "clamp(0.7rem, 1vw, 1rem)",
            }}
          />
          {t("categories.add")}
        </button>
      </div>

      {/* Categories list */}
      <div
        className="overflow-y-auto"
        style={{ maxHeight: "clamp(20rem, 50vw, 55rem)" }}
      >
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Tag
              style={{
                width: "clamp(2rem, 3vw, 3.5rem)",
                height: "clamp(2rem, 3vw, 3.5rem)",
                marginBottom: "0.5rem",
              }}
            />
            <p style={{ fontSize: "clamp(0.7rem, 0.95vw, 1rem)" }}>
              {t("categories.empty")}
            </p>
          </div>
        ) : (
          categories.map((cat, idx) => {
            const count = actionCountForCategory(cat.id);
            return (
              <div
                key={cat.id}
                className="flex items-center justify-between group transition-colors hover:bg-[#b38e19]/5"
                style={{
                  padding:
                    "clamp(0.6rem, 1vw, 1rem) clamp(0.9rem, 1.6vw, 1.6rem)",
                  borderBottom:
                    idx < categories.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      width: "clamp(1.8rem, 2.5vw, 2.8rem)",
                      height: "clamp(1.8rem, 2.5vw, 2.8rem)",
                      backgroundColor: "rgba(25,53,90,0.08)",
                    }}
                  >
                    <Tag
                      className="text-[#19355a]"
                      style={{
                        width: "clamp(0.7rem, 1vw, 1.1rem)",
                        height: "clamp(0.7rem, 1vw, 1.1rem)",
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="font-medium text-gray-800 truncate"
                      style={{ fontSize: "clamp(0.7rem, 0.95vw, 1rem)" }}
                    >
                      {cat.categoryName}
                    </p>
                    <p
                      className="text-gray-400"
                      style={{ fontSize: "clamp(0.55rem, 0.78vw, 0.82rem)" }}
                    >
                      {count} {t("categories.actionsCount")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(cat)}
                    className="rounded-lg p-1 text-gray-400 hover:text-[#19355a] hover:bg-[#19355a]/10 transition"
                    title={t("categories.edit")}
                  >
                    <Pencil
                      style={{
                        width: "clamp(0.75rem, 1vw, 1.1rem)",
                        height: "clamp(0.75rem, 1vw, 1.1rem)",
                      }}
                    />
                  </button>
                  <button
                    onClick={() => onDelete(cat)}
                    className="rounded-lg p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                    title={t("categories.delete")}
                  >
                    <Trash2
                      style={{
                        width: "clamp(0.75rem, 1vw, 1.1rem)",
                        height: "clamp(0.75rem, 1vw, 1.1rem)",
                      }}
                    />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
