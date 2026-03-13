# PyLab
PyLab is a free and open-source browser-based Python environment designed for teaching and learning.    
  
## Features
• Runs entirely in the browser
• Powered by Pyodide (currently Python 3.11)  
• Monaco Editor (VS Code editor)  
• Side-by-side editor and output console  
• Draggable workspace divider    
• Autosave with localStorage  
• Upload and download `.py` files  
• Open source and free forever  
  
## Project Structure  
```  
	index.html
	style.css
	js/
		main.js
		runtime.js
		storage.js
```  

## Architecture  
PyLab is designed with a layered architecture:  
```  
	UI Layer  
		Monaco Editor  
		Layout and controls  
	Runtime Layer  
		Pyodide execution  
		Stdout and stdin handling  
	Storage Layer  
		Local autosave  
		Share Links  
		Future cloud syncing  
```  
This structure keeps the editor interface separate from the Python execution engine and storage, making it easier to expand PyLab into a full classroom platform.  
  
## Roadmap  
• Turtle graphics  
• Shareable links  
• Student and teacher accounts  
• Cloud program storage  
• Collaborative coding  
• Keyboard shortcuts

## Keyboard Shortcuts  
 
Planned shortcuts:  
  
| Shortcut | Action |  
|--------|--------|  
| Shift + Enter | Run code |  
| Ctrl + Enter | Run code |  
| Ctrl + / | Comment line |  
| Ctrl + S | Save code |  
