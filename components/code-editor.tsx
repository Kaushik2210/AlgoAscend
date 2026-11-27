"use client";

import { useState } from "react";
import Monaco, { loader } from "@monaco-editor/react";

loader.config({ paths:{vs:"/monaco/vs"} });

export default function CodeEditor({code, onChange, language, light}: {code: string; onChange: (code: string) => void; language: string; light: boolean}) {
  const [plain, setPlain] = useState(false);
  return <div className="editor-area">
    <button type="button" className="button secondary editor-mode" onClick={() => setPlain(!plain)}>{plain ? "Use Monaco editor" : "Use plain text editor"}</button>
    {plain ? <label><span className="sr-only">Source code</span><textarea className="plain-editor" spellCheck={false} value={code} onChange={event => onChange(event.target.value)}/></label> :
      <Monaco height="340px" language={language === "c" ? "cpp" : language} theme={light ? "vs" : "vs-dark"} value={code} onChange={value => onChange(value ?? "")} loading={<p className="editor-loading" role="status">Loading Monaco editor…</p>} options={{ariaLabel:"Source code",tabFocusMode:true,minimap:{enabled:false},fontSize:14,wordWrap:"on",scrollBeyondLastLine:false,automaticLayout:true,accessibilitySupport:"auto"}}/>}
  </div>;
}
