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

    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.Enter, function () {
      runCode();
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
