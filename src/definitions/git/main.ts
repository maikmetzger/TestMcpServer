import { COMMIT_HISTORY } from "./commitHistory.js";
import { DIFF } from "./diff.js";

const GIT_TOOLS = [COMMIT_HISTORY, DIFF] as const;
export default GIT_TOOLS;
