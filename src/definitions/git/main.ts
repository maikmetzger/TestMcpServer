import { HISTORY_SEARCH } from "./historySearch.js";
import { GET_COMMIT } from "./getCommit.js";

const GIT_TOOLS = [HISTORY_SEARCH, GET_COMMIT] as const;

export default GIT_TOOLS;
