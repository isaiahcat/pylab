let editor;

window.addEventListener("load", () => {

  require.config({
    paths: {
      vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs"
    }
  });

  require(["vs/editor/editor.main"], function () {

    editor = monaco.editor.create(document.getElementById("editor"), {
      value: 'print("Hello from PyLab")',
      language: "python",
      theme: "vs-dark",
      automaticLayout: true,
      fontSize: 16,
      minimap: { enabled: false }
    });

    // Load saved code
    const saved = loadCode();
    if (saved) {
      editor.setValue(saved);
    }

    // Save on change
    editor.onDidChangeModelContent(() => {
      saveCode(editor.getValue());
    });

    // Shift+Enter keyboard shortcut
    editor.onKeyDown((e) => {
      if (e.shiftKey && e.keyCode === monaco.KeyCode.Enter) {
        e.preventDefault();
        runCode();
      }
    });
  });

});

window.addEventListener("resize", () => {
  if (editor) {
    const container = document.getElementById("editor");
    editor.layout({
      width: container.clientWidth,
      height: container.clientHeight
    });
  }
});

document.getElementById("downloadBtn").onclick = function () {
  const code = editor.getValue();

  const blob = new Blob([code], { type: "text/x-python" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "pylab_code.py";
  a.click();

  URL.revokeObjectURL(url);
};

const uploadBtn = document.getElementById("uploadBtn");
const uploadFile = document.getElementById("uploadFile");

uploadBtn.onclick = () => {
  uploadFile.click();
};

uploadFile.onchange = function () {
  const file = uploadFile.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    editor.setValue(e.target.result);
  };

  reader.readAsText(file);
};

const divider = document.getElementById("divider");
const editorPane = document.getElementById("editor");
const outputPane = document.querySelector(".output-panel");
const workspace = document.querySelector(".workspace");

let dragging = false;

divider.addEventListener("mousedown", () => {
  dragging = true;
});

document.addEventListener("mouseup", () => {
  dragging = false;
});

document.addEventListener("mousemove", (e) => {
  if (!dragging) return;

  const rect = workspace.getBoundingClientRect();
  const percent = ((e.clientX - rect.left) / rect.width) * 100;

  editorPane.style.width = percent + "%";
  outputPane.style.width = (100 - percent) + "%";
});