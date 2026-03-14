let pyodide = null;
let inputResolver = null;

async function init() {
  pyodide = await loadPyodide();
  console.log("Pyodide ready");

  const version = await pyodide.runPythonAsync(`
    import platform
    platform.python_version()
  `);

  document.getElementById("pyversion").textContent =
    "Python " + version;

  pyodide.setStdin({
    stdin: async () => {
      return await consoleInput("");
    }
  });
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

function consoleInput(promptText) {
  const output = document.getElementById("output");
  const wrapper = document.createElement("div");
  const input = document.createElement("input");
  const label = document.createElement("span");
  label.textContent = promptText;

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  output.appendChild(wrapper);

  input.focus();

  return new Promise((resolve) => {
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          const value = input.value;
          wrapper.remove();
          const line = document.createElement("div");
          line.textContent = promptText + value;
          output.appendChild(line);
          resolve(value + "\n");
        }
      });
    });
}

init();
