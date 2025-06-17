export default function MenuItem({
  icon,
  children,
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="menu-item"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "#f5f5f5";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
      }}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
}
