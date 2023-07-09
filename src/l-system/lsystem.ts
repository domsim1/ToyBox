import { Toolbox, ToolBuilder } from "../../lib/toolbox/toolbox";
import { Vector2D } from "../../lib/vector/vector2d";

enum Action {
  Draw,
  RotateRight,
  RotateLeft,
  Store,
  Get
}


type Cache = {
  vec: Vector2D,
  rot: number,
}

type Line = {
  to: Vector2D,
  from: Vector2D,
}

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d")!;
document.body.appendChild(canvas);

class Rule {
  public start: string;
  public rules: Map<string, string>;
  public actions: Map<string, Action>;
  public angle: number;

  constructor(start: string, rules: Map<string, string>, actions: Map<string, Action>, angle: number) {
    this.start = start;
    this.rules = rules;
    this.actions = actions;
    this.angle = angle;
  }

  public getChar(char: string) {
    return this.rules.get(char) || char;
  }

  public getAction(char: string): Action {
    return this.actions.get(char)!;
  }
}

const generateLines = (startPos: Vector2D, generations: number, lengthMod: number, rule: Rule): Line[] => {
  let length = -200;
  let arrangment = rule.start;
  for (let i = 0; i < generations; i++) {
    length *= lengthMod;
    let newArrangement = "";
    for (const char of arrangment) {
      newArrangement += rule.getChar(char)
    }
    arrangment = newArrangement
  }

  const lines: Line[] = [];
  let from = startPos;
  ctx.moveTo(from.x, from.y);
  let rot = 0;
  const cache: Cache[] = [];
  for (const char of arrangment) {
    switch (rule.getAction(char)) {
      case Action.Draw:
        const to = from.add(new Vector2D(0, length).rotate(deg2rad(rot)));
        lines.push({ to, from })
        from = to;
        break;
      case Action.RotateRight:
        rot += rule.angle;
        break;
      case Action.RotateLeft:
        rot -= rule.angle;
        break;
      case Action.Store:
        cache.push({ vec: from, rot });
        break;
      case Action.Get:
        const data = cache.pop()!;
        from = data.vec;
        rot = data.rot;
        break;
    }
  }
  return lines;
}

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
}

const FractalPlant = new Rule(
  "X",
  new Map([
    ["X", "F+[[X]-X]-F[-FX]+X"],
    ["F", "FF"],
  ]),
  new Map([
    ["F", Action.Draw],
    ["+", Action.RotateRight],
    ["-", Action.RotateLeft],
    ["[", Action.Store],
    ["]", Action.Get],
  ]),
  25,
);

const DragonCurve = new Rule(
  "F",
  new Map([
    ["F", "F+G"],
    ["G", "F-G"],
  ]),
  new Map([
    ["F", Action.Draw],
    ["G", Action.Draw],
    ["+", Action.RotateRight],
    ["-", Action.RotateLeft],
  ]),
  90,
);

const SierpinskiTriangle = new Rule(
  "F-G-G",
  new Map([
    ["F", "F-G+F+G-F"],
    ["G", "GG"]
  ]),
  new Map([
    ["F", Action.Draw],
    ["G", Action.Draw],
    ["+", Action.RotateRight],
    ["-", Action.RotateLeft],
  ]),
  120,
)


const drawFractalPlant = (): void => {
  const lines = generateLines(
    new Vector2D(canvas.width / 2, canvas.height),
    6,
    0.52,
    FractalPlant,
  );
  state.shouldStop = false;
  requestAnimationFrame(() => drawLine(lines));
}

const drawDragonCurve = (): void => {
  const lines = generateLines(
    new Vector2D(canvas.width / 2, canvas.height / 2),
    14,
    0.76,
    DragonCurve,
  );
  state.shouldStop = false;
  requestAnimationFrame(() => drawLine(lines));
}

const drawSierpinskiTriangle = (): void => {
  const lines = generateLines(
    new Vector2D(canvas.width, canvas.height),
    6,
    0.58,
    SierpinskiTriangle,
  );
  state.shouldStop = false;
  requestAnimationFrame(() => drawLine(lines));
}

const drawLine = (lines: Line[]): void => {
  if (state.shouldStop) {
    return;
  }
  const line = lines.shift()!;
  ctx.beginPath();
  ctx.moveTo(line.from.x, line.from.y);
  ctx.lineTo(line.to.x, line.to.y);
  ctx.stroke();
  if (lines.length > 0) {
    requestAnimationFrame(() => drawLine(lines));
  }
}

const clearCanvas = () => {
  state.shouldStop = true;
  requestAnimationFrame(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
}

const state = {
  shouldStop: true
}

new Toolbox(
  new ToolBuilder()
    .addButtonTool("Draw Dragon Curve", drawDragonCurve)
    .addButtonTool("Draw Fractal Plant", drawFractalPlant)
    .addButtonTool("Draw Sierpinski Triangle", drawSierpinskiTriangle)
    .addButtonTool("Stop Draw", () => state.shouldStop = true)
    .addButtonTool("Clear Canvas", clearCanvas)
    .build()
);

