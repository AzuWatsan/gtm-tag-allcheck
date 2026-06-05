import { useRef, useState } from "react";

interface Props {
  onFile: (file: File) => void;
  fileName?: string;
  error?: string;
}

const MAX_SIZE = 50 * 1024 * 1024;

export function UploadArea({ onFile, fileName, error }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(file: File) {
    if (!file.name.endsWith(".json")) {
      alert("JSONファイルを選択してください");
      return;
    }
    if (file.size > MAX_SIZE) {
      alert("ファイルサイズが大きすぎます（上限50MB）");
      return;
    }
    onFile(file);
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? "#1A1917" : error ? "#DC2626" : "#C8C5BB"}`,
        borderRadius: "8px",
        padding: "2.5rem 2rem",
        textAlign: "center",
        background: dragging ? "#F0EFE9" : "#FAFAF8",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      <div style={{ fontSize: "28px", marginBottom: "8px", color: "#9B9890" }}>↑</div>

      {fileName ? (
        <>
          <div style={{ fontSize: "13px", fontWeight: 500, color: "#1A1917", marginBottom: "4px" }}>
            {fileName}
          </div>
          <div style={{ fontSize: "12px", color: "#9B9890" }}>
            別のファイルをドロップするか、クリックして選択
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: "14px", fontWeight: 500, color: "#1A1917", marginBottom: "4px" }}>
            GTM コンテナ JSON をドロップ
          </div>
          <div style={{ fontSize: "12px", color: "#9B9890" }}>
            またはクリックしてファイルを選択 · .json のみ · 最大 50MB
          </div>
        </>
      )}

      {error && (
        <div style={{
          marginTop: "10px", fontSize: "12px", color: "#DC2626",
          background: "#FEF2F2", borderRadius: "4px", padding: "4px 10px",
          display: "inline-block",
        }}>
          {error}
        </div>
      )}
    </div>
  );
}
