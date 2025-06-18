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
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Modal from "./Modal";
import SortableTab from "./SortableTab";
import InsertButton from "./InsertButton";
import AddPageTab from "./AddPageTab";
import ContextMenu from "./ContextMenu";
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

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
        modifiers={[restrictToHorizontalAxis]}
      >
        <SortableContext
          items={tabs.map(({ id }) => id)}
          strategy={horizontalListSortingStrategy}
        >
          <nav className="flex items-center border-t border-gray-300 py-2.5 px-0 bg-white sticky bottom-0 z-30 overflow-x-auto relative">
            {/* Combined section with tabs, dashed line and spacing */}
            <div className="relative flex items-center z-10 pr-6">
              {/* Dashed line behind tabs - only show if there are tabs */}
              {tabs.length > 0 && (
                <div
                  className="absolute top-1/2 left-0 right-0 border-b-2 border-dashed border-gray-300 z-0"
                  style={{ transform: "translateY(-50%)" }}
                ></div>
              )}

              {tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  className="flex items-center text-gray-400 mx-1 relative z-10 navbar-item"
                >
                  {index > 0 && (
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
            </div>

            {/* Right section: Add Page button */}
            <div className="flex-shrink-0 z-10">
              <AddPageTab
                onClick={() => {
                  setInsertIndex(tabs.length);
                  setModalOpen(true);
                }}
              />
            </div>
          </nav>
        </SortableContext>
      </DndContext>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          tabId={contextMenu.tabId}
          tabs={tabs}
          setTabs={setTabs}
          onClose={() => setContextMenu(null)}
          onRename={(tabId, currentName) => {
            setRenamingTabId(tabId);
            setRenamingTabName(currentName);
          }}
        />
      )}

      {/* Modal for adding new tab */}
      {modalOpen && (
        <Modal
          title="Name your form page"
          inputValue={newTabName}
          onChange={setNewTabName}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddTab}
          buttonLabel="Continue"
        />
      )}

      {/* Modal for renaming a tab */}
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
          buttonLabel="Save"
        />
      )}
    </>
  );
}
