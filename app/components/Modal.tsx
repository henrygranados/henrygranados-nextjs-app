export default function Modal({
  title,
  inputValue,
  onChange,
  onClose,
  onSubmit,
  submitLabel,
}: {
  title: string;
  inputValue: string;
  onChange: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  submitLabel: string;
}) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 border-none bg-transparent text-base cursor-pointer"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        <h2 className="mb-2.5">{title}</h2>

        <input value={inputValue} onChange={(e) => onChange(e.target.value)} />

        <div className="text-right">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded border-none cursor-pointer"
            onClick={onSubmit}
            disabled={!inputValue.trim()}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
