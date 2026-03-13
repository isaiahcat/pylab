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

  pyodide.setStdin({
    stdin: async () => {
      return await stdinFromConsole("");
    }
  });

  try {
    await pyodide.runPythonAsync(code);
  } catch (err) {
    output.textContent += err;
  }
}

function stdinFromConsole(promptText) {
  return new Promise((resolve) => {

    const output = document.getElementById("output");

    const span = document.createElement("span");
    span.textContent = promptText;

    const input = document.createElement("input");
    input.className = "stdin-input";

    output.appendChild(span);
    output.appendChild(input);

    input.focus();

    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const value = input.value;
        input.remove();

        const text = document.createTextNode(value + "\n");
        output.appendChild(text);

        resolve(value + "\n");
      }
    });
  });
}

init();
