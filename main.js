let pyodide = null;

async function init() {
  pyodide = await loadPyodide();
  console.log("Pyodide ready");
}

init();

async function runCode() {
  if (!pyodide) {
    alert("Python is still loading. Please wait a moment.");
    return;
  }

  const code = document.getElementById("editor").value;
  const output = document.getElementById("output");

  try {
    let result = await pyodide.runPythonAsync(code);
    output.textContent = result ?? "";
  } catch (err) {
    output.textContent = err;
  }
}