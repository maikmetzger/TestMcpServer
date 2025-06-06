import { WORD_COUNT } from "./wordCount.js";
import { SEARCH_REPLACE } from "./searchReplace.js";

const TEXT_TOOLS = [WORD_COUNT, SEARCH_REPLACE] as const;
export default TEXT_TOOLS;
