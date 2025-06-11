import FilesystemController from "../controllers/FilesystemController.js";
import MathsController from "../controllers/MathsController.js";
import ImageController from "../controllers/ImageController.js";
import ShopwareController from "../controllers/ShopwareController.js";
import GitController from "../controllers/GitController.js";
import TextController from "../controllers/TextController.js";
import NetworkController from "../controllers/NetworkController.js";
import DateTimeController from "../controllers/DateTimeController.js";
import SecurityController from "../controllers/SecurityController.js";
import WorkflowController from "../controllers/WorkflowController.js";

import FILESYSTEM_TOOLS from "../definitions/filesystem/main.js";
import MATHS_TOOLS from "../definitions/maths/main.js";
import IMAGE_TOOLS from "../definitions/image/main.js";
import SHOPWARE_TOOLS from "../definitions/shopware/main.js";
import GIT_TOOLS from "../definitions/git/main.js";
import TEXT_TOOLS from "../definitions/text/main.js";
import NETWORK_TOOLS from "../definitions/network/main.js";
import DATETIME_TOOLS from "../definitions/datetime/main.js";
import SECURITY_TOOLS from "../definitions/security/main.js";
import WORKFLOW_TOOLS from "../definitions/workflow/main.js";

type ControllerMap = {
  [key: string]: {
    controller: any;
    handlerMethod: string;
  };
};

const controllerMap: ControllerMap = {
  // Math tools
  addition: {
    controller: MathsController,
    handlerMethod: "handleAddition",
  },
  multiplication: {
    controller: MathsController,
    handlerMethod: "handleMultiplication",
  },
  division: {
    controller: MathsController,
    handlerMethod: "handleDivision",
  },
  subtraction: {
    controller: MathsController,
    handlerMethod: "handleSubtraction",
  },
  squareRoot: {
    controller: MathsController,
    handlerMethod: "handleSquareRoot",
  },
  power: {
    controller: MathsController,
    handlerMethod: "handlePower",
  },
  modulo: {
    controller: MathsController,
    handlerMethod: "handleModulo",
  },
  logarithm: {
    controller: MathsController,
    handlerMethod: "handleLogarithm",
  },
  average: {
    controller: MathsController,
    handlerMethod: "handleAverage",
  },
  standardDeviation: {
    controller: MathsController,
    handlerMethod: "handleStandardDeviation",
  },
  // Image tools
  imageConversion: {
    controller: ImageController,
    handlerMethod: "handleImageConversion",
  },
  imageResize: {
    controller: ImageController,
    handlerMethod: "handleImageResize",
  },
  // Git tools
  commitHistory: {
    controller: GitController,
    handlerMethod: "handleCommitHistory",
  },
  diff: {
    controller: GitController,
    handlerMethod: "handleDiff",
  },
  // Text tools
  wordCount: {
    controller: TextController,
    handlerMethod: "handleWordCount",
  },
  searchReplace: {
    controller: TextController,
    handlerMethod: "handleSearchReplace",
  },
  // Network tools
  httpRequest: {
    controller: NetworkController,
    handlerMethod: "handleHttpRequest",
  },
  ping: {
    controller: NetworkController,
    handlerMethod: "handlePing",
  },
  // DateTime tools
  timestampConvert: {
    controller: DateTimeController,
    handlerMethod: "handleTimestampConvert",
  },
  schedule: {
    controller: DateTimeController,
    handlerMethod: "handleSchedule",
  },
  // Security tools
  hash: {
    controller: SecurityController,
    handlerMethod: "handleHash",
  },
  checksum: {
    controller: SecurityController,
    handlerMethod: "handleChecksum",
  },
  // Filesystem tools
  tree: {
    controller: FilesystemController,
    handlerMethod: "handleTree",
  },
  search: {
    controller: FilesystemController,
    handlerMethod: "handleSearch",
  },
  read: {
    controller: FilesystemController,
    handlerMethod: "handleRead",
  },
  // Shopware tools
  shopwareExec: {
    controller: ShopwareController,
    handlerMethod: "handleContainerExec",
  },
  shopwareLogs: {
    controller: ShopwareController,
    handlerMethod: "handleLogs",
  },
  shopwareBuild: {
    controller: ShopwareController,
    handlerMethod: "handleBuild",
  },
  // Workflow tools
  confirmHttpRequest: {
    controller: WorkflowController,
    handlerMethod: "handleConfirmHttpRequest",
  },
  performHttpRequest: {
    controller: WorkflowController,
    handlerMethod: "handlePerformHttpRequest",
  },
  confirmPing: {
    controller: WorkflowController,
    handlerMethod: "handleConfirmPing",
  },
  performPing: {
    controller: WorkflowController,
    handlerMethod: "handlePerformPing",
  },
};

export function getToolDefinitions() {
  return {
    MATHS_TOOLS,
    FILESYSTEM_TOOLS,
    IMAGE_TOOLS,
    SHOPWARE_TOOLS,
    GIT_TOOLS,
    TEXT_TOOLS,
    NETWORK_TOOLS,
    DATETIME_TOOLS,
    SECURITY_TOOLS,
    WORKFLOW_TOOLS,
  };
}
export function getToolHandler(toolName: string) {
  const mapping = controllerMap[toolName];
  if (!mapping) {
    return null;
  }

  // Normal handling for all tools
  const controllerInstance = new mapping.controller();
  return async (args: any) => {
    return await controllerInstance[mapping.handlerMethod](
      ...Object.values(args)
    );
  };
}
