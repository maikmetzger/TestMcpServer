import { HTTP_REQUEST } from "./httpRequest.js";
import { PING } from "./ping.js";

const NETWORK_TOOLS = [HTTP_REQUEST, PING] as const;
export default NETWORK_TOOLS;
