let pyodide = null;

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

async function runCode() {
  if (!pyodide) {
    alert("Python still loading");
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

init();
