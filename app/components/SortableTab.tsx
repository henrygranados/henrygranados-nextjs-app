import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FileText, EllipsisVertical } from "lucide-react";

export default function SortableTab({
  id,
  label,
  isActive,
  onClick,
  onRightClick,
}: {
  id: string;
  label: string;
  isActive: boolean;
  onClick: () => void;
  onRightClick: (e: React.MouseEvent, rect: DOMRect) => void;
}) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
  });

  const outerStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: 0,
    border: isActive ? "0.5px solid #eee" : "none",
    color: isActive ? "#000" : "#8C93A1",
    boxShadow: isActive ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
    backgroundColor: "#fff",
    userSelect: "none" as const,
    flexShrink: 0,
    cursor: "grab",
    borderRadius: 8,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={outerStyle}
      onContextMenu={(e) => {
        e.preventDefault();
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        onRightClick(e, rect);
      }}
    >
      <div
        {...listeners}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        }}
        className={`px-2.5 py-2 flex items-center justify-center h-full rounded-lg ${
          isActive ? "bg-white" : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        <FileText
          className="mr-1"
          color={isActive ? "#F6A31D" : "currentColor"}
        />
        {label}
        {isActive && (
          <EllipsisVertical className="ml-1" size={16} color="#6b7280" />
        )}
      </div>
    </div>
  );
}
