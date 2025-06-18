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
    <div className="inline-block mx-2 -ml-px">
      <div
        ref={buttonRef}
        onClick={onClick}
        className="w-5 h-5 flex items-center justify-center rounded-full transition-colors cursor-pointer relative z-10"
        style={{
          backgroundColor: hover ? "#fff" : "transparent",
          border: hover ? "1px solid #ddd" : "none",
        }}
      >
        {hover && (
          <span className="flex items-center -ml-4px">
            <Plus size={10} color="#000" />
          </span>
        )}
      </div>
    </div>
  );
}
