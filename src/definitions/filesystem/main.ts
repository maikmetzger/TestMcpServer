import { TREE } from "./tree.js";
import { SEARCH } from "./search.js";
import { READ } from "./read.js";

const FILESYSTEM_TOOLS = [TREE, SEARCH, READ] as const;

export default FILESYSTEM_TOOLS;
