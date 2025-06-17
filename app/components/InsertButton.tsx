import { Plus } from "lucide-react";
import { useState } from "react";

export default function InsertButton({ onClick }: { onClick: () => void }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onClick}
      className="w-6 h-6 mx-1 flex items-center justify-center rounded-full transition-colors duration-200 ease-in-out cursor-pointer"
      style={{
        backgroundColor: hover ? "#f0f0f0" : "transparent",
      }}
    >
      {hover && <Plus size={16} color="#000" />}
    </div>
  );
}
