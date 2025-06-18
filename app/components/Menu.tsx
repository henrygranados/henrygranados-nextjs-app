import { useEffect, useRef } from "react";
import { Clipboard, Copy, Flag, PenLine, Trash2 } from "lucide-react";
import MenuItem from "./MenuItem";
import { Tab } from "../context/TabsContext";

type MenuProps = {
  position: { x: number; y: number };
  tabId: string;
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
  onClose: () => void;
  onRename: (tabId: string, currentName: string) => void;
};

export default function Menu({
  position,
  tabId,
  tabs,
  setTabs,
  onClose,
  onRename,
}: MenuProps) {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!contextMenuRef.current?.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const moveToFirstPosition = () => {
    const index = tabs.findIndex(({ id }) => id === tabId);
    if (index > 0) {
      const tab = tabs[index];
      setTabs([tab, ...tabs.slice(0, index), ...tabs.slice(index + 1)]);
    }
    onClose();
  };

  const handleRename = () => {
    const tab = tabs.find(({ id }) => id === tabId);
    if (tab) onRename(tab.id, tab.label);
    onClose();
  };

  const handleDelete = () => {
    setTabs(tabs.filter(({ id }) => id !== tabId));
    onClose();
  };

  const menuItems = [
    {
      icon: <Flag size={16} className="mr-2" color="blue" />,
      label: "Set as first page",
      onClick: moveToFirstPosition,
    },
    {
      icon: <PenLine size={16} className="mr-2" color="#9EA3B2" />,
      label: "Rename",
      onClick: handleRename,
    },
    {
      icon: <Clipboard size={16} className="mr-2" color="#9EA3B2" />,
      label: "Copy",
      onClick: onClose,
    },
    {
      icon: <Copy size={16} className="mr-2" color="#9EA3B2" />,
      label: "Duplicate",
      onClick: onClose,
    },
    {
      icon: <Trash2 size={16} className="mr-2" color="#ea352f" />,
      label: "Delete",
      onClick: handleDelete,
      textColor: "#ea352f",
    },
  ];

  return (
    <div
      ref={contextMenuRef}
      className="menu rounded-lg overflow-hidden p-0 bg-gray- w-56"
      style={{ top: position.y - 255, left: position.x }}
    >
      <div className="font-bold text-base px-4 py-2 border-b border-gray-200 text-gray-800 bg-[#FAFBFD] select-none relative -top-2">
        Settings
      </div>

      <div className="bg-white pb-0">
        {menuItems.map((item, index) => {
          const isLast = index === menuItems.length - 1;

          return (
            <div key={`menu-${index}`}>
              {isLast && (
                <div className="flex justify-center my-1">
                  <hr className="w-[90%] border-gray-200" />
                </div>
              )}
              <MenuItem
                icon={item.icon}
                onClick={item.onClick}
                textColor={item.textColor}
              >
                {item.label}
              </MenuItem>
            </div>
          );
        })}
      </div>
    </div>
  );
}
