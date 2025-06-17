import { FileText } from "lucide-react";

export default function Modal({
  title,
  inputValue,
  onChange,
  onClose,
  onSubmit,
  buttonLabel,
}: {
  title: string;
  inputValue: string;
  onChange: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  buttonLabel: string;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute -top-3 -right-3 w-7 h-7 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 text-xl font-light cursor-pointer shadow-sm hover:bg-gray-100"
          onClick={onClose}
          aria-label="Close modal"
        >
          <span className="relative top-[1px]">×</span>
        </button>

        <div className="flex items-center mb-2.5">
          <FileText color="#F6A31D" className="mr-2" />
          <h2 className="m-0 text-black">{title}</h2>
        </div>

        <input
          value={inputValue}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-black"
          placeholder="Enter text here..."
        />

        <div className="text-right">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg border-none cursor-pointer"
            onClick={onSubmit}
            disabled={!inputValue.trim()}
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
