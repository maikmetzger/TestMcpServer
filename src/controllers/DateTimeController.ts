import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

class DateTimeController {
  async handleTimestampConvert(value: string | number) {
    try {
      let result;
      if (typeof value === "number" || /^[0-9]+$/.test(String(value))) {
        const date = new Date(Number(value));
        result = date.toISOString();
      } else {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid date");
        }
        result = date.getTime();
      }
      return {
        content: [{ type: "text", text: String(result) }],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text", text: `Error converting timestamp: ${error?.message || "Unknown error"}` },
        ],
        isError: true,
      };
    }
  }

  async handleSchedule(command: string, delaySeconds: number) {
    try {
      if (delaySeconds > 5) {
        throw new Error("Delay too long (max 5 seconds)");
      }
      await new Promise((resolve) => setTimeout(resolve, delaySeconds * 1000));
      const { stdout } = await execPromise(command);
      return {
        content: [{ type: "text", text: stdout.trim() }],
        isError: false,
      };
    } catch (error: any) {
      return {
        content: [
          { type: "text", text: `Error running scheduled command: ${error?.message || "Unknown error"}` },
        ],
        isError: true,
      };
    }
  }
}

export default DateTimeController;
