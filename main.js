let pyodide = null;
let editor;

async function init() {
  pyodide = await loadPyodide();
  console.log("Pyodide ready");

  const version = await pyodide.runPythonAsync(`
    import platform
    platform.python_version()
  `);

  document.getElementById("pyversion").textContent =
    "Python " + version;
}

init();

async function runCode() {
  if (!pyodide) {
    alert("Python is still loading. Please wait.");
    return;
  }

  if (!editor) {
    alert("Editor still loading. Please wait.");
    return;
  }

  const code = editor.getValue();
  const output = document.getElementById("output");

  output.textContent = "";

  pyodide.setStdout({
    raw: (text) => {
      output.textContent += String.fromCharCode(text);
      output.scrollTop = output.scrollHeight;
    }
  });

  try {
    await pyodide.runPythonAsync(code);
  } catch (err) {
    output.textContent += err;
  }
}

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

    // Autosave with localStorage
    const AUTOSAVE_KEY = "pylab-code";

    // Load saved code
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (saved) {
      editor.setValue(saved);
    }

    // Save on change
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      localStorage.setItem(AUTOSAVE_KEY, code);
    });

    editor.addAction({
      id: "run-code",
      label: "Run Python Code",
      keybindings: [
        monaco.KeyMod.Shift | monaco.KeyCode.Enter
      ],
      run: function () {
        console.log("Shift+Enter pressed")
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