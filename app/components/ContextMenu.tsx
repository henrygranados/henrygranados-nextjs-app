import { useEffect, useRef } from "react";
import { Clipboard, Copy, Flag, PenLine, Trash2 } from "lucide-react";
import MenuItem from "./MenuItem";
import { Tab } from "../context/TabsContext";

type ContextMenuProps = {
  position: { x: number; y: number };
  tabId: string;
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
  onClose: () => void;
  onRename: (tabId: string, currentName: string) => void;
};

export default function ContextMenu({
  position,
  tabId,
  tabs,
  setTabs,
  onClose,
  onRename,
}: ContextMenuProps) {
  const contextMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={contextMenuRef}
      className="menu rounded-lg overflow-hidden p-0 bg-gray- w-56"
      style={{
        top: position.y - 255,
        left: position.x,
      }}
      onClick={onClose}
    >
      <div className="font-bold text-base px-4 py-2 border-b border-gray-200 text-gray-800  bg-[#FAFBFD] select-none relative -top-2">
        Settings
      </div>

      <div className="bg-white -pt-2 pb-0">
        <MenuItem
          icon={<Flag size={16} className="mr-2" color="blue" />}
          onClick={() => {
            const index = tabs.findIndex(({ id }) => id === tabId);
            if (index > 0) {
              const tab = tabs[index];
              const newTabs = [
                tab,
                ...tabs.slice(0, index),
                ...tabs.slice(index + 1),
              ];
              setTabs(newTabs);
            }
            onClose();
          }}
        >
          Set as first page
        </MenuItem>

        <MenuItem
          icon={<PenLine size={16} className="mr-2" color="#9EA3B2" />}
          onClick={() => {
            const tab = tabs.find(({ id }) => id === tabId);
            if (tab) {
              onRename(tab.id, tab.label);
            }
            onClose();
          }}
        >
          Rename
        </MenuItem>

        <MenuItem
          icon={<Clipboard size={16} className="mr-2" color="#9EA3B2" />}
          onClick={() => {}}
        >
          Copy
        </MenuItem>
        <MenuItem
          icon={<Copy size={16} className="mr-2" color="#9EA3B2" />}
          onClick={() => {}}
        >
          Duplicate
        </MenuItem>

        <div className="flex justify-center my-1">
          <hr className="w-[90%] border-gray-200" />
        </div>

        <MenuItem
          icon={<Trash2 size={16} className="mr-2" color="#ea352f" />}
          onClick={() => {
            setTabs(tabs.filter(({ id }) => id !== tabId));
            onClose();
          }}
          textColor="#ea352f"
        >
          Delete
        </MenuItem>
      </div>
    </div>
  );
}
