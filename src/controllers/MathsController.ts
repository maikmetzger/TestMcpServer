class MathsController {
  async handleAddition(a: number, b: number) {
    try {
      const result = a + b;
      return {
        content: [
          {
            type: "text",
            text: `Sum: ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating sum: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleMultiplication(a: number, b: number) {
    try {
      const result = a * b;
      return {
        content: [
          {
            type: "text",
            text: `Product: ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating product: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleDivision(a: number, b: number) {
    try {
      const result = a / b;
      return {
        content: [
          {
            type: "text",
            text: `Quotient: ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating quotient: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleSubtraction(a: number, b: number) {
    try {
      const result = a - b;
      return {
        content: [
          {
            type: "text",
            text: `Difference: ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating difference: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
}

export default MathsController;
