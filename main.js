let pyodide;

async function init() {
  pyodide = await loadPyodide();
}

init();

async function runCode() {
  let code = document.getElementById("editor").value;

  try {
    let result = await pyodide.runPythonAsync(code);
    document.getElementById("output").textContent = result;
  } catch (err) {
    document.getElementById("output").textContent = err;
  }
}