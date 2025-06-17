"use client";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Flag, PenLine, Trash2 } from "lucide-react";
import Modal from "./Modal";
import MenuItem from "./MenuItem";
import SortableTab from "./SortableTab";
import InsertButton from "./InsertButton";
import AddPageTab from "./AddPageTab";
import { Tab } from "../context/TabsContext";

export default function BottomNav({
  tabs,
  setTabs,
}: {
  tabs: Tab[];
  setTabs: (tabs: Tab[]) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [modalOpen, setModalOpen] = useState(false);
  const [newTabName, setNewTabName] = useState("");
  const [insertIndex, setInsertIndex] = useState<number | null>(null);

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    tabId: string;
  } | null>(null);

  const [renamingTabId, setRenamingTabId] = useState<string | null>(null);
  const [renamingTabName, setRenamingTabName] = useState("");
  const contextMenuRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  /**
   * Reorders tabs when a tab is dragged to a new position by finding the source
   * and destination indices and using arrayMove to create a new array with the updated order
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = tabs.findIndex(({ id }) => id === active.id);
      const newIndex = tabs.findIndex(({ id }) => id === over?.id);
      setTabs(arrayMove(tabs, oldIndex, newIndex));
    }
  };

  const handleTabClick = (id: string) => {
    router.push(`/${id}`);
  };

  /**
   * Creates a URL-friendly ID from the tab name, adds the tab at the specified position,
   * updates the state, navigates to the new tab, and resets the form
   */
  const handleAddTab = () => {
    const id = newTabName.toLowerCase().replace(/\s+/g, "-");
    const newTab = { id, label: newTabName };
    const newTabs = [...tabs];
    if (insertIndex !== null) {
      newTabs.splice(insertIndex, 0, newTab);
    } else {
      newTabs.push(newTab);
    }
    setTabs(newTabs);
    router.push(`/${id}`);
    setModalOpen(false);
    setNewTabName("");
    setInsertIndex(null);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={tabs.map((t) => t.id)}
          strategy={horizontalListSortingStrategy}
        >
          <nav className="flex items-center border-t border-gray-300 py-2.5 px-0 bg-white sticky bottom-0 z-30 overflow-x-auto">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center text-gray-400">
                {index > 0 && index < tabs.length && (
                  <InsertButton
                    onClick={() => {
                      setInsertIndex(index);
                      setModalOpen(true);
                    }}
                  />
                )}
                <SortableTab
                  id={tab.id}
                  label={tab.label}
                  isActive={pathname === `/${tab.id}`}
                  onClick={() => handleTabClick(tab.id)}
                  onRightClick={(e, rect) => {
                    e.preventDefault();
                    setContextMenu({
                      x: rect.left,
                      y: rect.top,
                      tabId: tab.id,
                    });
                  }}
                />
              </div>
            ))}
            <AddPageTab
              onClick={() => {
                setInsertIndex(tabs.length);
                setModalOpen(true);
              }}
            />
          </nav>
        </SortableContext>
      </DndContext>

      {/* Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="menu"
          style={{
            top: contextMenu.y - 170,
            left: contextMenu.x,
          }}
          onClick={() => setContextMenu(null)}
        >
          <div className="font-bold text-base px-4 py-2 border-b border-gray-200 text-gray-800 bg-gray-100 select-none">
            Settings
          </div>

          <div className="bg-white">
            {/* Menu Items */}
            <MenuItem
              icon={<Flag size={16} className="mr-2" color="blue" />}
              onClick={() => {
                const index = tabs.findIndex(
                  ({ id }) => id === contextMenu.tabId
                );
                if (index > 0) {
                  const tab = tabs[index];
                  const newTabs = [
                    tab,
                    ...tabs.slice(0, index),
                    ...tabs.slice(index + 1),
                  ];
                  setTabs(newTabs);
                }
                setContextMenu(null);
              }}
            >
              Set as first page
            </MenuItem>

            <MenuItem
              icon={<PenLine size={16} className="mr-2" />}
              onClick={() => {
                const tab = tabs.find(({ id }) => id === contextMenu.tabId);
                if (tab) {
                  setRenamingTabId(tab.id);
                  setRenamingTabName(tab.label);
                }
                setContextMenu(null);
              }}
            >
              Rename
            </MenuItem>

            <MenuItem
              icon={<Trash2 size={16} className="mr-2" color="#ea352f" />}
              onClick={() => {
                setTabs(tabs.filter(({ id }) => id !== contextMenu.tabId));
                setContextMenu(null);
              }}
            >
              Delete
            </MenuItem>
          </div>
        </div>
      )}

      {modalOpen && (
        <Modal
          title="Name your form page"
          inputValue={newTabName}
          onChange={setNewTabName}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddTab}
          submitLabel="Continue"
        />
      )}

      {renamingTabId && (
        <Modal
          title="Rename Tab"
          inputValue={renamingTabName}
          onChange={setRenamingTabName}
          onClose={() => setRenamingTabId(null)}
          onSubmit={() => {
            setTabs(
              tabs.map((t) =>
                t.id === renamingTabId ? { ...t, label: renamingTabName } : t
              )
            );
            setRenamingTabId(null);
          }}
          submitLabel="Save"
        />
      )}
    </>
  );
}
