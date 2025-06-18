import { Plus } from "lucide-react";

export default function AddPageTab({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="mx-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-black font-medium cursor-pointer select-none flex-shrink-0 flex items-center relative z-10 add-btn"
    >
      <Plus size={16} className="mr-1" />
      Add page
    </div>
  );
}
