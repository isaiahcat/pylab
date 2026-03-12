let pyodide = null;

async function init() {
  pyodide = await loadPyodide();
  console.log("Pyodide ready");
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