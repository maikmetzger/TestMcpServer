import { CONFIRM_HTTP_REQUEST } from './confirmHttpRequest.js';
import { PERFORM_HTTP_REQUEST } from './performHttpRequest.js';

const WORKFLOW_TOOLS = [CONFIRM_HTTP_REQUEST, PERFORM_HTTP_REQUEST] as const;
export default WORKFLOW_TOOLS;
