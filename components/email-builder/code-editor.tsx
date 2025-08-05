"use client";
import Editor from "@monaco-editor/react";
import { useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export default function DevSendCodeEditor({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  useEffect(() => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      jsx: monaco.languages.typescript.JsxEmit.React,
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      allowJs: true,
      noEmit: true,
      typeRoots: ["node_modules/@types"],
    });

    // Load @types/react
    fetch("https://unpkg.com/@types/react/index.d.ts")
      .then((res) => res.text())
      .then((reactTypes) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          reactTypes,
          "file:///node_modules/@types/react/index.d.ts"
        );
      });

    // Load @types/react-dom
    fetch("https://unpkg.com/@types/react-dom/index.d.ts")
      .then((res) => res.text())
      .then((domTypes) => {
        monaco.languages.typescript.typescriptDefaults.addExtraLib(
          domTypes,
          "file:///node_modules/@types/react-dom/index.d.ts"
        );
      });
  }, []);

  return (
    <div className="w-full h-[600px] border rounded-xl overflow-hidden">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        value={value}
        onChange={(value) => onChange?.(value || "")}
        theme="vs-dark"
        path="index.tsx" // 👈 Important: use .tsx to activate JSX
      />
    </div>
  );
}
