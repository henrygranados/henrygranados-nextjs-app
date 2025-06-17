export default function AddPageTab({ onClick }: { onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="mx-1 px-4 py-2 rounded-lg border border-gray-200 bg-white text-black font-medium cursor-pointer select-none flex-shrink-0"
    >
      + Add page
    </div>
  );
}
