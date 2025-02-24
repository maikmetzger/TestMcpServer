import { IMAGE_CONVERSION } from "./imageConversion.js";
import { IMAGE_RESIZE } from "./imageResize.js";

const IMAGE_TOOLS = [IMAGE_CONVERSION, IMAGE_RESIZE] as const;

export default IMAGE_TOOLS;
