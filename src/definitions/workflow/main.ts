import { CONFIRM_PING } from "./confirmPing.js";
import { PERFORM_PING } from "./performPing.js";

const WORKFLOW_TOOLS = [CONFIRM_PING, PERFORM_PING] as const;
export default WORKFLOW_TOOLS;
