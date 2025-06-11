import { CONFIRM_HTTP_REQUEST } from './confirmHttpRequest.js';
import { PERFORM_HTTP_REQUEST } from './performHttpRequest.js';
import { CONFIRM_PING } from "./confirmPing.js";
import { PERFORM_PING } from "./performPing.js";

const WORKFLOW_TOOLS = [CONFIRM_HTTP_REQUEST, PERFORM_HTTP_REQUEST, CONFIRM_PING, PERFORM_PING] as const;
export default WORKFLOW_TOOLS;