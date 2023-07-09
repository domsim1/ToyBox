enum ToolType {
  Input,
  Button,
}

interface InputTool {
  _type: ToolType.Input;
  label: string;
  default: string;
  onChange: (value: string) => void;
}

interface ButtonTool {
  _type: ToolType.Button;
  label: string;
  onClick: () => void;
}

type Tool = InputTool | ButtonTool


class Toolbox {
  private box: HTMLDivElement;

  constructor(tools: Tool[]) {
    this.box = Toolbox.createBox();

    for (const tool of tools) {
      switch (tool._type) {
        case ToolType.Input:
          const input = Toolbox.createInputBox(tool);
          this.box.appendChild(input);
          break;
        case ToolType.Button:
          const button = Toolbox.createButtonBox(tool);
          this.box.appendChild(button);
          break;
      }
    }

    this.box.appendChild(
      Toolbox.createButtonBox({
        _type: ToolType.Button,
        label: "Close",
        onClick: () => { this.box.style.display = "none" }
      })
    );

    document.body.appendChild(this.box);
  }


  private static createBox(): HTMLDivElement {
    const box = document.createElement("div");
    const styles = this.createStyles();
    document.body.appendChild(styles);
    box.classList.add("toolbox")
    return box;
  }

  private static createInputBox(tool: InputTool): HTMLDivElement {
    const box = document.createElement("div");
    box.classList.add("tool-input");
    const b = document.createElement("b");
    b.innerText = tool.label;
    const input = document.createElement("input");
    input.addEventListener("input", () => {
      tool.onChange(input.value);
    });
    if (tool.default != "") {
      input.value = tool.default;
      tool.onChange(input.value);
    }
    box.appendChild(b);
    box.appendChild(input);
    return box;
  }

  private static createButtonBox(tool: ButtonTool): HTMLDivElement {
    const box = document.createElement("div");
    box.classList.add("tool-button");
    const button = document.createElement("button");
    button.innerText = tool.label;
    button.addEventListener("click", () => {
      tool.onClick();
    })
    box.appendChild(button);
    return box;
  }

  private static createStyles(): HTMLStyleElement {
    const style = document.createElement("style");
    style.innerText = `
    .toolbox {
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      width: 300px;
      max-width: 300px;
      background-color: black;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2;
      padding: 2px;
      gap: 6px;
    }

    .tool-input {
      background-color: black;
      display: flex;
      flex-direction: row;
      width: 100%;
    }

    .tool-button {
      background-color: black;
      display: flex;
      flex-direction: row;
      width: 100%;
    }

    .tool-button > button {
      background-color: black;
      color: white;
      border: 1px solid white;
      flex: 1 1 auto;
    }

    .tool-button > button:hover {
      background-color: dimgray;
    }

    .tool-button > button:active {
      background-color: lightgray;
    }

    .tool-input > input {
        flex: 1 1 auto;
        background: black;
        color: white;
        border: none;
        border-bottom: 1px dotted white;
    }

    .tool-input > input:focus {
        outline: none;
        border-bottom: 1px solid white;
    }

    .tool-input > b {
      color: white;
    }
    `
    return style;
  }
}

class ToolBuilder {
  private tools: Tool[]
  constructor() {
    this.tools = [];
  }

  public addInputTool(label: string, onChange: (value: string) => void, defaultValue: string = ""): ToolBuilder {
    this.tools.push({
      _type: ToolType.Input,
      default: defaultValue,
      label,
      onChange,
    });
    return this;
  }

  public addButtonTool(label: string, onClick: () => void): ToolBuilder {
    this.tools.push({
      _type: ToolType.Button,
      label,
      onClick,
    });
    return this;
  }

  public build(): Tool[] {
    return this.tools;
  }
}

export {
  Toolbox,
  ToolBuilder,
}
