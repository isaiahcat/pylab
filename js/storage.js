const AUTOSAVE_KEY = "pylab-code";

function saveCode(code) {
  localStorage.setItem(AUTOSAVE_KEY, code);
}

function loadCode() {
  return localStorage.getItem(AUTOSAVE_KEY);
}

function clearSavedCode() {
  localStorage.removeItem(AUTOSAVE_KEY);
}
