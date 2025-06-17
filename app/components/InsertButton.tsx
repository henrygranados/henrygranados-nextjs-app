import { Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function InsertButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return;

      const rect = buttonRef.current.getBoundingClientRect();
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      setHover(isInside);
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="inline-block -ml-2">
      <div
        ref={buttonRef}
        onClick={onClick}
        className="w-5 h-5 flex items-center justify-center rounded-full transition-colors cursor-pointer"
        style={{
          backgroundColor: hover ? "#fff" : "transparent",
          border: hover ? "1px solid #ddd" : "none",
        }}
      >
        {hover ? (
          <Plus size={14} color="#000" />
        ) : (
          <span className="tracking-[1px]">---</span>
        )}
      </div>
    </div>
  );
}
