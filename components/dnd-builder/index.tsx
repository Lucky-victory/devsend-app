"use client";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  FC,
  PropsWithChildren,
} from "react";
import { DndProvider, useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { create } from "zustand";
import { produce } from "immer";
import {
  Text,
  Heading1,
  Image as ImageIcon,
  Columns,
  Minus,
  Type,
  MousePointerClick,
  Trash2,
  Copy,
  Move,
  Settings,
  Eye,
  ChevronLeft,
  ChevronRight,
  Bold,
  Italic,
  UnderlineIcon,
  Link2,
} from "lucide-react";

// --- TYPESCRIPT INTERFACES ---

type ElementType =
  | "text"
  | "button"
  | "image"
  | "divider"
  | "heading"
  | "row"
  | "column";

interface Path {
  rowIndex: number;
  colIndex?: number;
  elementIndex?: number;
}

interface BaseElement {
  id: string;
  type: ElementType;
  style: React.CSSProperties;
}

interface TextElement extends BaseElement {
  type: "text";
  content: string;
}

interface HeadingElement extends BaseElement {
  type: "heading";
  content: string;
  props: {
    level: "h1" | "h2" | "h3";
  };
}

interface ButtonElement extends BaseElement {
  type: "button";
  content: string;
  props: {
    href: string;
  };
}

interface ImageElement extends BaseElement {
  type: "image";
  props: {
    src: string;
    alt: string;
  };
}

interface DividerElement extends BaseElement {
  type: "divider";
}

type EmailElement =
  | TextElement
  | ButtonElement
  | ImageElement
  | DividerElement
  | HeadingElement;

interface EmailColumn {
  id: string;
  type: "column";
  elements: EmailElement[];
  style: React.CSSProperties;
}

interface EmailRow {
  id: string;
  type: "row";
  columns: EmailColumn[];
}

interface EmailBody {
  width: number;
  backgroundColor: string;
  contentBackgroundColor: string;
  fontFamily: string;
}

interface Email {
  rows: EmailRow[];
  body: EmailBody;
}

type SelectedElement = (EmailElement | EmailRow | EmailColumn) & { path: Path };

interface EmailState {
  email: Email;
  selectedElement: SelectedElement | null;
  setSelectedElement: (element: SelectedElement | null) => void;
  addRow: (index: number, row: EmailRow) => void;
  updateRow: (rowIndex: number, updatedRow: EmailRow) => void;
  deleteRow: (rowIndex: number) => void;
  moveRow: (dragIndex: number, hoverIndex: number) => void;
  addColumn: (rowIndex: number, column: EmailColumn) => void;
  updateColumn: (
    rowIndex: number,
    colIndex: number,
    updatedColumn: EmailColumn
  ) => void;
  deleteColumn: (rowIndex: number, colIndex: number) => void;
  addElementToColumn: (
    rowIndex: number,
    colIndex: number,
    index: number,
    element: EmailElement
  ) => void;
  updateElement: (
    rowIndex: number,
    colIndex: number,
    elementIndex: number,
    updatedElement: EmailElement
  ) => void;
  deleteElement: (
    rowIndex: number,
    colIndex: number,
    elementIndex: number
  ) => void;
  moveElement: (dragPath: Required<Path>, hoverPath: Required<Path>) => void;
  updateBodyStyle: (style: Partial<EmailBody>) => void;
  duplicateElement: (
    rowIndex: number,
    colIndex: number,
    elementIndex: number
  ) => void;
  duplicateRow: (rowIndex: number) => void;
}

// --- STATE MANAGEMENT (ZUSTAND) ---
const useEmailStore = create<EmailState>((set) => ({
  email: {
    rows: [],
    body: {
      width: 600,
      backgroundColor: "#f3f4f6",
      contentBackgroundColor: "#ffffff",
      fontFamily: "Arial, sans-serif",
    },
  },
  selectedElement: null,
  setSelectedElement: (element) => set({ selectedElement: element }),
  addRow: (index, row) =>
    set(
      produce((state: EmailState) => {
        state.email.rows.splice(index, 0, row);
      })
    ),
  updateRow: (rowIndex, updatedRow) =>
    set(
      produce((state: EmailState) => {
        state.email.rows[rowIndex] = updatedRow;
      })
    ),
  deleteRow: (rowIndex) =>
    set(
      produce((state: EmailState) => {
        state.email.rows.splice(rowIndex, 1);
        state.selectedElement = null;
      })
    ),
  moveRow: (dragIndex, hoverIndex) =>
    set(
      produce((state: EmailState) => {
        const dragRow = state.email.rows[dragIndex];
        state.email.rows.splice(dragIndex, 1);
        state.email.rows.splice(hoverIndex, 0, dragRow);
      })
    ),
  addColumn: (rowIndex, column) =>
    set(
      produce((state: EmailState) => {
        state.email.rows[rowIndex].columns.push(column);
      })
    ),
  updateColumn: (rowIndex, colIndex, updatedColumn) =>
    set(
      produce((state: EmailState) => {
        state.email.rows[rowIndex].columns[colIndex] = updatedColumn;
      })
    ),
  deleteColumn: (rowIndex, colIndex) =>
    set(
      produce((state: EmailState) => {
        state.email.rows[rowIndex].columns.splice(colIndex, 1);
      })
    ),
  addElementToColumn: (rowIndex, colIndex, index, element) =>
    set(
      produce((state: EmailState) => {
        state.email.rows[rowIndex].columns[colIndex].elements.splice(
          index,
          0,
          element
        );
      })
    ),
  updateElement: (rowIndex, colIndex, elementIndex, updatedElement) =>
    set(
      produce((state: EmailState) => {
        state.email.rows[rowIndex].columns[colIndex].elements[elementIndex] =
          updatedElement;
        state.selectedElement = {
          ...updatedElement,
          path: { rowIndex, colIndex, elementIndex },
        };
      })
    ),
  deleteElement: (rowIndex, colIndex, elementIndex) =>
    set(
      produce((state: EmailState) => {
        state.email.rows[rowIndex].columns[colIndex].elements.splice(
          elementIndex,
          1
        );
        state.selectedElement = null;
      })
    ),
  moveElement: (dragPath, hoverPath) =>
    set(
      produce((state: EmailState) => {
        const {
          rowIndex: dragRowIndex,
          colIndex: dragColIndex,
          elementIndex: dragElIndex,
        } = dragPath;
        const {
          rowIndex: hoverRowIndex,
          colIndex: hoverColIndex,
          elementIndex: hoverElIndex,
        } = hoverPath;

        const dragElement =
          state.email.rows[dragRowIndex].columns[dragColIndex].elements[
            dragElIndex
          ];
        state.email.rows[dragRowIndex].columns[dragColIndex].elements.splice(
          dragElIndex,
          1
        );
        state.email.rows[hoverRowIndex].columns[hoverColIndex].elements.splice(
          hoverElIndex,
          0,
          dragElement
        );
      })
    ),
  updateBodyStyle: (style) =>
    set(
      produce((state: EmailState) => {
        state.email.body = { ...state.email.body, ...style };
      })
    ),
  duplicateElement: (rowIndex, colIndex, elementIndex) =>
    set(
      produce((state: EmailState) => {
        const elementToDuplicate =
          state.email.rows[rowIndex].columns[colIndex].elements[elementIndex];
        const newElement = JSON.parse(JSON.stringify(elementToDuplicate));
        newElement.id = `el-${Date.now()}`;
        state.email.rows[rowIndex].columns[colIndex].elements.splice(
          elementIndex + 1,
          0,
          newElement
        );
      })
    ),
  duplicateRow: (rowIndex) =>
    set(
      produce((state: EmailState) => {
        const rowToDuplicate = state.email.rows[rowIndex];
        const newRow = JSON.parse(JSON.stringify(rowToDuplicate));
        newRow.id = `row-${Date.now()}`;
        newRow.columns.forEach((col: EmailColumn) => {
          col.id = `col-${Date.now()}-${Math.random()}`;
          col.elements.forEach((el: EmailElement) => {
            el.id = `el-${Date.now()}-${Math.random()}`;
          });
        });
        state.email.rows.splice(rowIndex + 1, 0, newRow);
      })
    ),
}));

// --- ITEM TYPES FOR DND ---
const ItemTypes = {
  COMPONENT: "component",
  ROW: "row",
  ELEMENT: "element",
};

// --- DRAGGABLE SIDEBAR COMPONENTS ---
const DraggableComponent: FC<PropsWithChildren<{ type: ElementType }>> = ({
  type,
  children,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.COMPONENT,
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex flex-col items-center justify-center p-2 m-1 border border-gray-200 rounded-lg cursor-grab hover:bg-gray-100 transition-colors ${isDragging ? "opacity-50" : "opacity-100"}`}
    >
      {children}
    </div>
  );
};

// --- SIDEBAR ---
const Sidebar: FC = () => {
  const [activeTab, setActiveTab] = useState("content");

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex-1 p-3 text-sm font-medium ${activeTab === "content" ? "bg-gray-100 text-gray-800" : "text-gray-500 hover:bg-gray-50"}`}
        >
          Content
        </button>
        <button
          onClick={() => setActiveTab("body")}
          className={`flex-1 p-3 text-sm font-medium ${activeTab === "body" ? "bg-gray-100 text-gray-800" : "text-gray-500 hover:bg-gray-50"}`}
        >
          Body
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">
        {activeTab === "content" && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Content Blocks
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <DraggableComponent type="text">
                <Type className="w-6 h-6 mb-1 text-gray-600" />
                <span className="text-xs">Text</span>
              </DraggableComponent>
              <DraggableComponent type="button">
                <MousePointerClick className="w-6 h-6 mb-1 text-gray-600" />
                <span className="text-xs">Button</span>
              </DraggableComponent>
              <DraggableComponent type="image">
                <ImageIcon className="w-6 h-6 mb-1 text-gray-600" />
                <span className="text-xs">Image</span>
              </DraggableComponent>
              <DraggableComponent type="divider">
                <Minus className="w-6 h-6 mb-1 text-gray-600" />
                <span className="text-xs">Divider</span>
              </DraggableComponent>
              <DraggableComponent type="heading">
                <Heading1 className="w-6 h-6 mb-1 text-gray-600" />
                <span className="text-xs">Heading</span>
              </DraggableComponent>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mt-6 mb-2">
              Layout
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <DraggableComponent type="column">
                <Columns className="w-6 h-6 mb-1 text-gray-600" />
                <span className="text-xs">Columns</span>
              </DraggableComponent>
            </div>
          </div>
        )}
        {activeTab === "body" && <BodySettings />}
      </div>
    </div>
  );
};

// --- SETTINGS PANEL ---
const SettingsPanel: FC = () => {
  const { selectedElement } = useEmailStore();
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  if (!isPanelOpen) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex justify-center pt-4">
        <button
          onClick={() => setIsPanelOpen(true)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    );
  }

  const renderSettings = () => {
    if (!selectedElement)
      return (
        <p className="text-sm text-gray-500">
          Select an element to edit its properties.
        </p>
      );
    switch (selectedElement.type) {
      case "text":
        return <TextSettings />;
      case "button":
        return <ButtonSettings />;
      case "image":
        return <ImageSettings />;
      case "divider":
        return <DividerSettings />;
      case "heading":
        return <HeadingSettings />;
      case "row":
        return <RowSettings />;
      case "column":
        return <ColumnSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="flex items-center justify-between p-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-md font-semibold text-gray-800">Settings</h2>
        </div>
        <button
          onClick={() => setIsPanelOpen(false)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>
      <div className="flex-grow p-4 overflow-y-auto">{renderSettings()}</div>
    </div>
  );
};

// --- SETTINGS COMPONENTS ---

interface SettingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
const SettingInput: FC<SettingInputProps> = ({ label, ...props }) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-gray-600 mb-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
    />
  </div>
);

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const ColorPicker: FC<ColorPickerProps> = ({ label, value, onChange }) => (
  <div className="mb-4">
    <label className="block text-xs font-medium text-gray-600 mb-1">
      {label}
    </label>
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={onChange}
        className="w-8 h-8 p-0 border-none cursor-pointer"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        className="w-full px-2 py-1.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
      />
    </div>
  </div>
);

interface PaddingEditorProps {
  label: string;
  value: React.CSSProperties;
  onChange: (newStyles: React.CSSProperties) => void;
}
const PaddingEditor: FC<PaddingEditorProps> = ({ label, value, onChange }) => {
  const handlePaddingChange = (side: string, val: string) => {
    const newValue = parseInt(val, 10) || 0;
    onChange({ ...value, [side]: `${newValue}px` });
  };
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-600 mb-2">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-gray-500">Top</label>
          <input
            type="number"
            value={parseInt(value.paddingTop as string) || 0}
            onChange={(e) => handlePaddingChange("paddingTop", e.target.value)}
            className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Bottom</label>
          <input
            type="number"
            value={parseInt(value.paddingBottom as string) || 0}
            onChange={(e) =>
              handlePaddingChange("paddingBottom", e.target.value)
            }
            className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Left</label>
          <input
            type="number"
            value={parseInt(value.paddingLeft as string) || 0}
            onChange={(e) => handlePaddingChange("paddingLeft", e.target.value)}
            className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500">Right</label>
          <input
            type="number"
            value={parseInt(value.paddingRight as string) || 0}
            onChange={(e) =>
              handlePaddingChange("paddingRight", e.target.value)
            }
            className="w-full mt-1 px-2 py-1.5 border border-gray-300 rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
};

const TextSettings: FC = () => {
  const { selectedElement, updateElement } = useEmailStore();
  if (selectedElement?.type !== "text") return null;
  const { path, style } = selectedElement;
  const handleChange = (prop: keyof React.CSSProperties, value: any) => {
    updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
      ...selectedElement,
      style: { ...style, [prop]: value },
    });
  };
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 border-b pb-2">
        Text Settings
      </h3>
      <ColorPicker
        label="Color"
        value={style.color as string}
        onChange={(e) => handleChange("color", e.target.value)}
      />
      <SettingInput
        label="Font Size (px)"
        type="number"
        value={parseInt(style.fontSize as string)}
        onChange={(e) => handleChange("fontSize", `${e.target.value}px`)}
      />
      <SettingInput
        label="Line Height"
        type="number"
        step="0.1"
        value={style.lineHeight as number}
        onChange={(e) => handleChange("lineHeight", e.target.value)}
      />
      <PaddingEditor
        label="Padding"
        value={style}
        onChange={(newPadding) =>
          updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
            ...selectedElement,
            style: { ...style, ...newPadding },
          })
        }
      />
    </div>
  );
};

const ButtonSettings: FC = () => {
  const { selectedElement, updateElement } = useEmailStore();
  if (selectedElement?.type !== "button") return null;
  const { path, style, content, props } = selectedElement;
  const handleStyleChange = (prop: keyof React.CSSProperties, value: any) =>
    updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
      ...selectedElement,
      style: { ...style, [prop]: value },
    });
  const handlePropChange = (prop: keyof ButtonElement["props"], value: any) =>
    updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
      ...selectedElement,
      props: { ...props, [prop]: value },
    });
  const handleContentChange = (value: string) =>
    updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
      ...selectedElement,
      content: value,
    });
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 border-b pb-2">
        Button Settings
      </h3>
      <SettingInput
        label="Text"
        value={content}
        onChange={(e) => handleContentChange(e.target.value)}
      />
      <SettingInput
        label="URL"
        value={props.href}
        onChange={(e) => handlePropChange("href", e.target.value)}
      />
      <ColorPicker
        label="Background Color"
        value={style.backgroundColor as string}
        onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
      />
      <ColorPicker
        label="Text Color"
        value={style.color as string}
        onChange={(e) => handleStyleChange("color", e.target.value)}
      />
      <SettingInput
        label="Border Radius (px)"
        type="number"
        value={parseInt(style.borderRadius as string)}
        onChange={(e) =>
          handleStyleChange("borderRadius", `${e.target.value}px`)
        }
      />
      <PaddingEditor
        label="Padding"
        value={style}
        onChange={(newPadding) =>
          updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
            ...selectedElement,
            style: { ...style, ...newPadding },
          })
        }
      />
    </div>
  );
};

const ImageSettings: FC = () => {
  const { selectedElement, updateElement } = useEmailStore();
  if (selectedElement?.type !== "image") return null;
  const { path, props, style } = selectedElement;
  const handlePropChange = (prop: keyof ImageElement["props"], value: string) =>
    updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
      ...selectedElement,
      props: { ...props, [prop]: value },
    });
  const handleStyleChange = (prop: keyof React.CSSProperties, value: any) =>
    updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
      ...selectedElement,
      style: { ...style, [prop]: value },
    });
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 border-b pb-2">
        Image Settings
      </h3>
      <SettingInput
        label="Image URL"
        value={props.src}
        onChange={(e) => handlePropChange("src", e.target.value)}
      />
      <SettingInput
        label="Alt Text"
        value={props.alt}
        onChange={(e) => handlePropChange("alt", e.target.value)}
      />
      <SettingInput
        label="Width (%)"
        type="number"
        max="100"
        min="10"
        value={parseInt(style.width as string) || 100}
        onChange={(e) => handleStyleChange("width", `${e.target.value}%`)}
      />
      <PaddingEditor
        label="Padding"
        value={style}
        onChange={(newPadding) =>
          updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
            ...selectedElement,
            style: { ...style, ...newPadding },
          })
        }
      />
    </div>
  );
};

const DividerSettings: FC = () => {
  const { selectedElement, updateElement } = useEmailStore();
  if (selectedElement?.type !== "divider") return null;
  const { path, style } = selectedElement;
  const handleStyleChange = (prop: keyof React.CSSProperties, value: any) =>
    updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
      ...selectedElement,
      style: { ...style, [prop]: value },
    });
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 border-b pb-2">
        Divider Settings
      </h3>
      <ColorPicker
        label="Color"
        value={style.borderTopColor as string}
        onChange={(e) => handleStyleChange("borderTopColor", e.target.value)}
      />
      <SettingInput
        label="Height (px)"
        type="number"
        value={parseInt(style.borderTopWidth as string)}
        onChange={(e) =>
          handleStyleChange("borderTopWidth", `${e.target.value}px`)
        }
      />
      <PaddingEditor
        label="Vertical Padding"
        value={style}
        onChange={(newPadding) =>
          updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
            ...selectedElement,
            style: { ...style, ...newPadding },
          })
        }
      />
    </div>
  );
};

const HeadingSettings: FC = () => {
  const { selectedElement, updateElement } = useEmailStore();
  if (selectedElement?.type !== "heading") return null;
  const { path, style, props } = selectedElement;
  const handleChange = (
    target: "style" | "props",
    prop: string,
    value: any
  ) => {
    const updatedElement = { ...selectedElement };
    if (target === "style") updatedElement.style = { ...style, [prop]: value };
    else updatedElement.props = { ...props, [prop]: value };
    updateElement(
      path.rowIndex,
      path.colIndex!,
      path.elementIndex!,
      updatedElement
    );
  };
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 border-b pb-2">
        Heading Settings
      </h3>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Level
        </label>
        <select
          value={props.level}
          onChange={(e) => handleChange("props", "level", e.target.value)}
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md"
        >
          <option value="h1">H1</option>
          <option value="h2">H2</option>
          <option value="h3">H3</option>
        </select>
      </div>
      <ColorPicker
        label="Color"
        value={style.color as string}
        onChange={(e) => handleChange("style", "color", e.target.value)}
      />
      <SettingInput
        label="Font Size (px)"
        type="number"
        value={parseInt(style.fontSize as string)}
        onChange={(e) =>
          handleChange("style", "fontSize", `${e.target.value}px`)
        }
      />
      <SettingInput
        label="Line Height"
        type="number"
        step="0.1"
        value={style.lineHeight as number}
        onChange={(e) => handleChange("style", "lineHeight", e.target.value)}
      />
      <PaddingEditor
        label="Padding"
        value={style}
        onChange={(newPadding) =>
          updateElement(path.rowIndex, path.colIndex!, path.elementIndex!, {
            ...selectedElement,
            style: { ...style, ...newPadding },
          })
        }
      />
    </div>
  );
};

const BodySettings: FC = () => {
  const { email, updateBodyStyle } = useEmailStore();
  const { body } = email;
  const handleChange = (prop: keyof EmailBody, value: any) =>
    updateBodyStyle({ [prop]: value });
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 border-b pb-2">
        Body Settings
      </h3>
      <SettingInput
        label="Content Width (px)"
        type="number"
        value={body.width}
        onChange={(e) => handleChange("width", parseInt(e.target.value))}
      />
      <ColorPicker
        label="Background Color"
        value={body.backgroundColor}
        onChange={(e) => handleChange("backgroundColor", e.target.value)}
      />
      <ColorPicker
        label="Content Background Color"
        value={body.contentBackgroundColor}
        onChange={(e) => handleChange("contentBackgroundColor", e.target.value)}
      />
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Font Family
        </label>
        <select
          value={body.fontFamily}
          onChange={(e) => handleChange("fontFamily", e.target.value)}
          className="w-full px-2 py-1.5 border border-gray-300 rounded-md"
        >
          <option value="Arial, sans-serif">Arial</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="'Times New Roman', Times, serif">
            Times New Roman
          </option>
        </select>
      </div>
    </div>
  );
};

const RowSettings: FC = () => {
  const { selectedElement, updateRow } = useEmailStore();
  if (selectedElement?.type !== "row") return null;
  const {
    path: { rowIndex },
  } = selectedElement;
  const handleColumnSplit = (split: number[]) => {
    const newColumns = split.map(
      (width) =>
        createNewElement("column", {
          style: { width: `${width}%` },
        }) as EmailColumn
    );
    const updatedRow = { ...selectedElement, columns: newColumns };
    updateRow(rowIndex, updatedRow);
  };
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 border-b pb-2">Row Settings</h3>
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Columns Layout
        </label>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => handleColumnSplit([100])}
            className="p-2 border rounded hover:bg-gray-100 flex justify-center items-center"
          >
            <div className="w-full h-6 bg-gray-200 rounded-sm"></div>
          </button>
          <button
            onClick={() => handleColumnSplit([50, 50])}
            className="p-2 border rounded hover:bg-gray-100 flex gap-1"
          >
            <div className="w-1/2 h-6 bg-gray-200 rounded-sm"></div>
            <div className="w-1/2 h-6 bg-gray-200 rounded-sm"></div>
          </button>
          <button
            onClick={() => handleColumnSplit([33.33, 33.33, 33.33])}
            className="p-2 border rounded hover:bg-gray-100 flex gap-1"
          >
            <div className="w-1/3 h-6 bg-gray-200 rounded-sm"></div>
            <div className="w-1/3 h-6 bg-gray-200 rounded-sm"></div>
            <div className="w-1/3 h-6 bg-gray-200 rounded-sm"></div>
          </button>
          <button
            onClick={() => handleColumnSplit([25, 75])}
            className="p-2 border rounded hover:bg-gray-100 flex gap-1"
          >
            <div className="w-1/4 h-6 bg-gray-200 rounded-sm"></div>
            <div className="w-3/4 h-6 bg-gray-200 rounded-sm"></div>
          </button>
          <button
            onClick={() => handleColumnSplit([75, 25])}
            className="p-2 border rounded hover:bg-gray-100 flex gap-1"
          >
            <div className="w-3/4 h-6 bg-gray-200 rounded-sm"></div>
            <div className="w-1/4 h-6 bg-gray-200 rounded-sm"></div>
          </button>
          <button
            onClick={() => handleColumnSplit([25, 25, 25, 25])}
            className="p-2 border rounded hover:bg-gray-100 flex gap-1"
          >
            <div className="w-1/4 h-6 bg-gray-200 rounded-sm"></div>
            <div className="w-1/4 h-6 bg-gray-200 rounded-sm"></div>
            <div className="w-1/4 h-6 bg-gray-200 rounded-sm"></div>
            <div className="w-1/4 h-6 bg-gray-200 rounded-sm"></div>
          </button>
        </div>
      </div>
    </div>
  );
};

const ColumnSettings: FC = () => {
  const { selectedElement, updateColumn } = useEmailStore();
  if (selectedElement?.type !== "column") return null;
  const {
    path: { rowIndex, colIndex },
    style,
  } = selectedElement;
  const handleStyleChange = (prop: keyof React.CSSProperties, value: any) => {
    const updatedColumn = {
      ...selectedElement,
      style: { ...style, [prop]: value },
    };
    updateColumn(rowIndex, colIndex!, updatedColumn);
  };
  return (
    <div>
      <h3 className="text-sm font-semibold mb-4 border-b pb-2">
        Column Settings
      </h3>
      <ColorPicker
        label="Background Color"
        value={style.backgroundColor as string}
        onChange={(e) => handleStyleChange("backgroundColor", e.target.value)}
      />
      <PaddingEditor
        label="Padding"
        value={style}
        onChange={(newPadding) =>
          updateColumn(rowIndex, colIndex!, {
            ...selectedElement,
            style: { ...style, ...newPadding },
          })
        }
      />
    </div>
  );
};

// --- EDITOR COMPONENTS ---
const createNewElement = (
  type: ElementType | "columns",
  overrides = {}
): EmailElement | EmailRow | EmailColumn => {
  const id = `${type}-${Date.now()}-${Math.random()}`;
  switch (type) {
    case "text":
      return {
        id,
        type,
        content: "<p>This is a new text block. Double-click to edit.</p>",
        style: {
          color: "#000000",
          fontSize: "16px",
          lineHeight: 1.5,
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
        },
        ...overrides,
      } as TextElement;
    case "button":
      return {
        id,
        type,
        content: "Button Text",
        props: { href: "#" },
        style: {
          backgroundColor: "#007bff",
          color: "#ffffff",
          borderRadius: "5px",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
        },
        ...overrides,
      } as ButtonElement;
    case "image":
      return {
        id,
        type,
        props: {
          src: "https://placehold.co/600x300/e2e8f0/cccccc?text=Image",
          alt: "placeholder",
        },
        style: {
          width: "100%",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "0px",
          paddingRight: "0px",
        },
        ...overrides,
      } as ImageElement;
    case "divider":
      return {
        id,
        type,
        style: {
          borderTopWidth: "1px",
          borderTopStyle: "solid",
          borderTopColor: "#cccccc",
          paddingTop: "10px",
          paddingBottom: "10px",
        },
        ...overrides,
      } as DividerElement;
    case "heading":
      return {
        id,
        type,
        content: "<h1>Heading Text</h1>",
        props: { level: "h1" },
        style: {
          color: "#000000",
          fontSize: "24px",
          lineHeight: 1.2,
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "20px",
          paddingRight: "20px",
        },
        ...overrides,
      } as HeadingElement;
    case "columns":
      return {
        id,
        type: "row",
        columns: [
          createNewElement("column", {
            style: { width: "50%" },
          }) as EmailColumn,
          createNewElement("column", {
            style: { width: "50%" },
          }) as EmailColumn,
        ],
      } as EmailRow;
    case "column":
      return {
        id,
        type,
        elements: [],
        style: {
          width: "100%",
          backgroundColor: "transparent",
          paddingTop: "0px",
          paddingBottom: "0px",
          paddingLeft: "0px",
          paddingRight: "0px",
        },
        ...overrides,
      } as EmailColumn;
    default:
      throw new Error(`Unknown element type: ${type}`);
  }
};

interface TiptapEditorProps {
  content: string;
  onUpdate: (newContent: string) => void;
}
const TiptapEditor: FC<TiptapEditorProps> = ({ content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Link.configure({ openOnClick: false }),
    ],
    content: content,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
    editorProps: {
      attributes: { class: "prose focus:outline-none w-full max-w-full" },
    },
  });
  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL", editor.getAttributes("link").href);
    if (url === null) return;
    if (url === "")
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
  }, [editor]);
  if (!editor) return null;
  return (
    <div className="tiptap-wrapper border border-gray-300 rounded-md p-1 bg-white">
      <div className="flex items-center flex-wrap gap-1 p-2 border-b">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          <Bold size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          <Italic size={16} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded ${editor.isActive("underline") ? "bg-gray-200" : ""}`}
        >
          <UnderlineIcon size={16} />
        </button>
        <button
          onClick={setLink}
          className={`p-1.5 rounded ${editor.isActive("link") ? "bg-gray-200" : ""}`}
        >
          <Link2 size={16} />
        </button>
        <input
          type="color"
          onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          value={editor.getAttributes("textStyle").color || "#000000"}
          className="w-6 h-6 p-0 border-none cursor-pointer bg-transparent"
        />
      </div>
      <EditorContent editor={editor} className="p-2 min-h-[150px]" />
    </div>
  );
};

interface ElementProps {
  element: EmailElement;
  path: Required<Path>;
}
const Element: FC<ElementProps> = ({ element, path }) => {
  const {
    selectedElement,
    setSelectedElement,
    updateElement,
    deleteElement,
    duplicateElement,
    moveElement,
  } = useEmailStore();
  const isSelected = selectedElement?.id === element.id;
  const ref = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.ELEMENT,
    item: { id: element.id, path },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const [, drop] = useDrop({
    accept: ItemTypes.ELEMENT,
    hover(item: { id: string; path: Required<Path> }) {
      if (!ref.current || item.path.elementIndex === path.elementIndex) return;
      moveElement(item.path, path);
      item.path = path;
    },
  });
  drag(drop(ref));
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement({ ...element, path });
  };
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (element.type === "text" || element.type === "heading")
      setIsEditing(true);
  };
  const handleUpdateContent = (newContent: string) =>
    updateElement(path.rowIndex, path.colIndex, path.elementIndex, {
      ...element,
      content: newContent,
    });

  const renderElement = () => {
    switch (element.type) {
      case "text":
      case "heading":
        return isEditing ? (
          <TiptapEditor
            content={element.content}
            onUpdate={handleUpdateContent}
          />
        ) : (
          <div
            style={element.style}
            dangerouslySetInnerHTML={{ __html: element.content }}
          />
        );
      case "button":
        return (
          <table
            cellPadding="0"
            cellSpacing="0"
            border={0}
            align="center"
            style={{ margin: "0 auto" }}
          >
            <tbody>
              <tr>
                <td
                  align="center"
                  style={{ ...element.style, display: "inline-block" }}
                >
                  <a
                    href={element.props.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      textDecoration: "none",
                      color: element.style.color as string,
                      display: "inline-block",
                      padding: `${element.style.paddingTop} ${element.style.paddingRight} ${element.style.paddingBottom} ${element.style.paddingLeft}`,
                    }}
                  >
                    {element.content}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        );
      case "image":
        return (
          <img
            src={element.props.src}
            alt={element.props.alt}
            style={element.style}
          />
        );
      case "divider":
        return (
          <div
            style={{ ...element.style, height: 0, borderTopStyle: "solid" }}
          ></div>
        );
      default:
        return <p>Unknown element</p>;
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        setIsEditing(false);
    };
    if (isEditing) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, isEditing]);

  return (
    <div
      ref={preview}
      className={`relative p-1 ${isDragging ? "opacity-50" : ""} ${isSelected ? "ring-2 ring-blue-500 ring-inset" : "ring-1 ring-transparent hover:ring-blue-300"}`}
      onClick={handleSelect}
      onDoubleClick={handleDoubleClick}
    >
      <div ref={ref}>{renderElement()}</div>
      {isSelected && (
        <div className="absolute -top-3 -right-3 flex items-center bg-blue-500 rounded-full text-white shadow-lg z-10">
          <button ref={drag} className="p-1.5 hover:bg-blue-600 cursor-move">
            <Move size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateElement(path.rowIndex, path.colIndex, path.elementIndex);
            }}
            className="p-1.5 hover:bg-blue-600"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteElement(path.rowIndex, path.colIndex, path.elementIndex);
            }}
            className="p-1.5 hover:bg-blue-600 rounded-r-full"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

interface ColumnProps {
  column: EmailColumn;
  path: { rowIndex: number; colIndex: number };
}
const Column: FC<ColumnProps> = ({ column, path }) => {
  const { setSelectedElement, addElementToColumn, selectedElement } =
    useEmailStore();
  const ref = useRef<HTMLTableCellElement>(null);
  const isSelected = selectedElement?.id === column.id;
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [ItemTypes.COMPONENT, ItemTypes.ELEMENT],
    drop: (item: { type: ElementType }, monitor) => {
      if (monitor.didDrop() || item.type === ItemTypes.ELEMENT) return;
      const newElement = createNewElement(item.type) as EmailElement;
      addElementToColumn(
        path.rowIndex,
        path.colIndex,
        column.elements.length,
        newElement
      );
      setSelectedElement({
        ...newElement,
        path: { ...path, elementIndex: column.elements.length },
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.getItemType() !== ItemTypes.ELEMENT,
      canDrop: monitor.canDrop(),
    }),
  });
  drop(ref);
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement({ ...column, path });
  };
  return (
    <td
      ref={ref}
      style={{ ...column.style, verticalAlign: "top" }}
      className={`transition-colors ${isSelected ? "ring-2 ring-green-500 ring-inset" : "hover:ring-1 hover:ring-green-300"}`}
      onClick={handleSelect}
    >
      <div className="min-h-[100px]">
        {column.elements.map((element, index) => (
          <Element
            key={element.id}
            element={element}
            path={{ ...path, elementIndex: index }}
          />
        ))}
        {(isOver && canDrop) ||
          (column.elements.length === 0 && !isOver && (
            <div className="h-full flex items-center justify-center bg-blue-50/50 border-2 border-dashed border-blue-300 rounded-md m-2 p-4">
              <p className="text-xs text-blue-500 text-center">
                Drop content here
              </p>
            </div>
          ))}
      </div>
    </td>
  );
};

interface RowProps {
  row: EmailRow;
  index: number;
}
const Row: FC<RowProps> = ({ row, index }) => {
  const {
    setSelectedElement,
    deleteRow,
    moveRow,
    duplicateRow,
    selectedElement,
  } = useEmailStore();
  const ref = useRef<HTMLDivElement>(null);
  const isSelected = selectedElement?.id === row.id;
  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemTypes.ROW,
    item: { id: row.id, index },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });
  const [, drop] = useDrop({
    accept: ItemTypes.ROW,
    hover(item: { index: number }) {
      if (!ref.current || item.index === index) return;
      moveRow(item.index, index);
      item.index = index;
    },
  });
  drop(preview(ref));
  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedElement({ ...row, path: { rowIndex: index } });
  };
  return (
    <div
      ref={ref}
      className={`relative p-2 ${isDragging ? "opacity-50" : ""} ${isSelected ? "ring-2 ring-purple-500" : "hover:ring-1 hover:ring-purple-300"}`}
      onClick={handleSelect}
    >
      <table cellPadding="0" cellSpacing="0" border="0" width="100%">
        <tbody>
          <tr>
            {row.columns.map((column, colIndex) => (
              <Column
                key={column.id}
                column={column}
                path={{ rowIndex: index, colIndex }}
              />
            ))}
          </tr>
        </tbody>
      </table>
      {isSelected && (
        <div className="absolute -top-3 -right-3 flex items-center bg-purple-500 rounded-full text-white shadow-lg z-10">
          <button
            ref={drag}
            className="p-1.5 hover:bg-purple-600 cursor-move rounded-l-full"
          >
            <Move size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              duplicateRow(index);
            }}
            className="p-1.5 hover:bg-purple-600"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteRow(index);
            }}
            className="p-1.5 hover:bg-purple-600 rounded-r-full"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

const MainEditor: FC = () => {
  const { email, addRow } = useEmailStore();
  const ref = useRef<HTMLDivElement>(null);
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: [ItemTypes.COMPONENT, ItemTypes.ROW],
    drop: (item: { type: ElementType | "columns" }, monitor) => {
      if (monitor.didDrop() || item.type === ItemTypes.ROW) return;
      const newRow =
        item.type === "columns"
          ? (createNewElement("columns") as EmailRow)
          : {
              id: `row-${Date.now()}`,
              type: "row",
              columns: [
                {
                  id: `col-${Date.now()}`,
                  type: "column",
                  elements: [createNewElement(item.type) as EmailElement],
                  style: { width: "100%" },
                } as EmailColumn,
              ],
            };
      addRow(email.rows.length, newRow);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  drop(ref);
  return (
    <div
      className="flex-1 p-8 bg-gray-100 overflow-y-auto"
      onClick={() => useEmailStore.getState().setSelectedElement(null)}
    >
      <div
        className="mx-auto transition-all"
        style={{
          width: `${email.body.width}px`,
          backgroundColor: email.body.backgroundColor,
        }}
      >
        <div
          ref={ref}
          className="shadow-lg min-h-[calc(100vh-120px)]"
          style={{
            backgroundColor: email.body.contentBackgroundColor,
            fontFamily: email.body.fontFamily,
          }}
        >
          {email.rows.map((row, index) => (
            <Row key={row.id} row={row} index={index} />
          ))}
          {(isOver && canDrop) ||
            (email.rows.length === 0 && (
              <div className="min-h-[200px] flex items-center justify-center bg-gray-50/50 border-2 border-dashed border-gray-300 rounded-md m-4">
                <p className="text-gray-500">
                  Drag content or layouts from the left panel
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function DNDEmailBuilder() {
  const { email } = useEmailStore();
  const generateHtml = () => {
    let html = `<!DOCTYPE html><html><head><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>body { margin: 0; padding: 0; background-color: ${email.body.backgroundColor}; -webkit-text-size-adjust: 100%; } .wrapper { width: 100%; table-layout: fixed; } .container { margin: 0 auto; width: 100%; max-width: ${email.body.width}px; } .content { background-color: ${email.body.contentBackgroundColor}; font-family: ${email.body.fontFamily}; } a { color: inherit; text-decoration: none; }</style></head><body><center class="wrapper"><table class="container" width="${email.body.width}" align="center" cellpadding="0" cellspacing="0" border="0"><tr><td><table class="content" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody>`;
    email.rows.forEach((row) => {
      html +=
        '<tr><td style="padding:0;"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>';
      row.columns.forEach((col) => {
        const colStyle = Object.entries(col.style)
          .map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`)
          .join(";");
        html += `<td valign="top" style="${colStyle}" width="${col.style.width}">`;
        col.elements.forEach((el) => {
          const elStyle = Object.entries(el.style)
            .map(
              ([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`
            )
            .join(";");
          switch (el.type) {
            case "text":
            case "heading":
              html += `<div style="${elStyle}">${el.content}</div>`;
              break;
            case "button":
              const {
                paddingTop,
                paddingBottom,
                paddingLeft,
                paddingRight,
                ...btnStyle
              } = el.style;
              const btnStyleString = Object.entries(btnStyle)
                .map(
                  ([k, v]) =>
                    `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`
                )
                .join(";");
              html += `<table cellpadding="0" cellspacing="0" border="0" align="center" style="margin: 0 auto;"><tr><td align="center" style="${btnStyleString}"><a href="${el.props.href}" target="_blank" style="text-decoration:none;display:inline-block;color:${el.style.color};padding:${paddingTop} ${paddingRight} ${paddingBottom} ${paddingLeft};">${el.content}</a></td></tr></table>`;
              break;
            case "image":
              html += `<img src="${el.props.src}" alt="${el.props.alt}" style="${elStyle}" width="${parseInt(el.style.width as string)}%">`;
              break;
            case "divider":
              html += `<div style="font-size:0;line-height:0;${elStyle}">&nbsp;</div>`;
              break;
          }
        });
        html += "</td>";
      });
      html += "</tr></tbody></table></td></tr>";
    });
    html += `</tbody></table></td></tr></table></center></body></html>`;
    const newWindow = window.open();
    newWindow?.document.write(html);
    newWindow?.document.close();
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen w-screen bg-gray-100 flex flex-col font-sans">
        <header className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
          <h1 className="text-lg font-bold text-gray-800">Email Editor</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={generateHtml}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
            >
              <Eye size={14} />
              Preview
            </button>
            <button className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-semibold">
              Save
            </button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MainEditor />
          <SettingsPanel />
        </div>
      </div>
    </DndProvider>
  );
}
