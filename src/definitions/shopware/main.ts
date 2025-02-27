import { CONTAINER_EXEC } from "./container.js";
import { LOGS } from "./logs.js";
import { BUILD } from "./build.js";

const SHOPWARE_TOOLS = [CONTAINER_EXEC, LOGS, BUILD] as const;

export default SHOPWARE_TOOLS;