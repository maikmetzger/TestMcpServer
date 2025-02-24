import { ADDITION } from "./addition.js";
import { MULTIPLICATION } from "./multiplication.js";
import { DIVISION } from "./division.js";
import { SUBTRACTION } from "./subtraction.js";
import { SQUARE_ROOT } from "./squareRoot.js";
import { POWER } from "./power.js";
import { MODULO } from "./modulo.js";
import { LOGARITHM } from "./logarithm.js";
import { AVERAGE } from "./average.js";

const MATHS_TOOLS = [
  ADDITION,
  MULTIPLICATION,
  DIVISION,
  SUBTRACTION,
  SQUARE_ROOT,
  POWER,
  MODULO,
  LOGARITHM,
  AVERAGE,
] as const;

export default MATHS_TOOLS;
