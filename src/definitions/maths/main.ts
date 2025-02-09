import { ADDITION } from "./addition.js";
import { MULTIPLICATION } from "./multiplication.js";
import { DIVISION } from "./division.js";
import { SUBTRACTION } from "./subtraction.js";

const MATHS_TOOLS = [ADDITION, MULTIPLICATION, DIVISION, SUBTRACTION] as const;

export default MATHS_TOOLS;
