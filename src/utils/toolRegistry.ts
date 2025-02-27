import FilesystemController from "../controllers/FilesystemController.js";
import MathsController from "../controllers/MathsController.js";
import ImageController from "../controllers/ImageController.js";
import FILESYSTEM_TOOLS from "../definitions/filesystem/main.js";
import MATHS_TOOLS from "../definitions/maths/main.js";
import IMAGE_TOOLS from "../definitions/image/main.js";

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
  // Image tools
  imageConversion: {
    controller: ImageController,
    handlerMethod: "handleImageConversion",
  },
  imageResize: {
    controller: ImageController,
    handlerMethod: "handleImageResize",
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
};

export function getToolDefinitions() {
  return {
    MATHS_TOOLS,
    FILESYSTEM_TOOLS,
    IMAGE_TOOLS,
  };
}

export function getToolHandler(toolName: string) {
  const mapping = controllerMap[toolName];
  if (!mapping) {
    return null;
  }

  const controllerInstance = new mapping.controller();
  return async (args: any) => {
    return await controllerInstance[mapping.handlerMethod](
      ...Object.values(args)
    );
  };
}
