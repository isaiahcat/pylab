let pyodide = null;

async function init() {
  pyodide = await loadPyodide();
  console.log("Pyodide ready");

  const version = pyodide.runPython(`
    import sys
    sys.version
  `);

  document.getElementById("pyversion").textContent =
    "Python " + version.split(" ")[0];
}

init();

async function runCode() {
  if (!pyodide) {
    alert("Python is still loading. Please wait.");
    return;
  }

  const code = document.getElementById("editor").value;
  const output = document.getElementById("output");

  output.textContent = "";

  pyodide.setStdout({
    batched: (text) => {
      output.textContent += text;
    }
  });

  try {
    await pyodide.runPythonAsync(code);
  } catch (err) {
    output.textContent += err;
  }
}