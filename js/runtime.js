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

  await pyodide.runPythonAsync(`
    import builtins
    import js
    import asyncio

    def input(prompt=""):
        loop = asyncio.get_event_loop()
        return loop.run_until_complete(js.consoleInput(prompt))

    builtins.input = input
  `);

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
      return await consoleInput("");
    }
  });

  try {
    await pyodide.runPythonAsync(code);
  } catch (err) {
    output.textContent += err;
  }
}

function consoleInput(promptText) {
  const prompt = document.createElement("prompt");
  prompt.textContent = promptText;

  const input = document.createElement("input");
  input.className = "stdin-input";

  const output = document.getElementById("output");
  output.appendChild(prompt);
  output.appendChild(input);

  input.focus();
  
  return new Promise((resolve) => {
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
