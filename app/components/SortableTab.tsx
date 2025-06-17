import { useSortable } from "@dnd-kit/sortable";
import { useRef } from "react";
import { CSS } from "@dnd-kit/utilities";
import { FileText } from "lucide-react";

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
  const { setNodeRef, attributes, listeners, transform, transition } =
    useSortable({ id });

  const pointerDown = useRef<{ x: number; y: number } | null>(null);
  const DRAG_THRESHOLD = 5;

  const outerStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    margin: 0,
    borderRadius: 8,
    border: isActive ? "2px solid #0070f3" : "1px solid #ccc",
    backgroundColor: "#fff",
    userSelect: "none" as const,
    flexShrink: 0,
    cursor: "grab",
  };

  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    pointerDown.current = { x: e.clientX, y: e.clientY };
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!pointerDown.current) return;

    const dx = Math.abs(e.clientX - pointerDown.current.x);
    const dy = Math.abs(e.clientY - pointerDown.current.y);
    pointerDown.current = null;

    if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
      onClick();
    }
  }

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
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClick();
        }}
        className="px-2.5 py-2 flex items-center justify-center h-full"
      >
        <FileText />
        {label}
      </div>
    </div>
  );
}
