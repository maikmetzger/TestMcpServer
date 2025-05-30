class MathsController {
  private validateNumericInputs(...args: any[]): void {
    for (let i = 0; i < args.length; i++) {
      const value = args[i];
      if (value === undefined || value === null) {
        throw new Error(`Parameter at position ${i + 1} is missing`);
      }
      if (typeof value !== "number") {
        throw new Error(`Parameter at position ${i + 1} must be a number`);
      }
      if (!isFinite(value)) {
        throw new Error(
          `Parameter at position ${i + 1} must be a finite number`
        );
      }
    }
  }

  async handleAddition(a: number, b: number) {
    try {
      this.validateNumericInputs(a, b);
      const result = a + b;

      // Check for potential overflow
      if (!isFinite(result)) {
        throw new Error("Result is too large or not a valid number");
      }

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
      this.validateNumericInputs(a, b);
      const result = a * b;

      // Check for potential overflow
      if (!isFinite(result)) {
        throw new Error("Result is too large or not a valid number");
      }

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
      this.validateNumericInputs(a, b);

      if (b === 0) {
        throw new Error("Division by zero is not allowed");
      }

      const result = a / b;

      // Check for potential infinity or NaN
      if (!isFinite(result)) {
        throw new Error("Result is too large or not a valid number");
      }

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
      this.validateNumericInputs(a, b);
      const result = a - b;

      // Check for potential overflow
      if (!isFinite(result)) {
        throw new Error("Result is too large or not a valid number");
      }

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

  async handleSquareRoot(a: number) {
    try {
      this.validateNumericInputs(a);

      if (a < 0) {
        throw new Error("Cannot calculate square root of a negative number");
      }

      const result = Math.sqrt(a);

      return {
        content: [
          {
            type: "text",
            text: `Square Root: ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating square root: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  async handlePower(a: number, b: number) {
    try {
      this.validateNumericInputs(a, b);

      // Guard against extremely large calculations
      if (b > 1000) {
        throw new Error("Exponent is too large - cannot exceed 1000");
      }

      const result = Math.pow(a, b);

      // Check for potential overflow
      if (!isFinite(result)) {
        throw new Error("Result is too large or not a valid number");
      }

      return {
        content: [
          {
            type: "text",
            text: `Power: ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating power: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleModulo(a: number, b: number) {
    try {
      this.validateNumericInputs(a, b);

      if (b === 0) {
        throw new Error("Modulo by zero is not allowed");
      }

      const result = a % b;

      return {
        content: [
          {
            type: "text",
            text: `Modulo: ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating modulo: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleLogarithm(a: number, b: number) {
    try {
      this.validateNumericInputs(a, b);

      if (a <= 0) {
        throw new Error("The number must be positive");
      }
      if (b <= 0 || b === 1) {
        throw new Error("The base must be positive and not equal to 1");
      }

      // Log base b of a = ln(a) / ln(b)
      const result = Math.log(a) / Math.log(b);

      return {
        content: [
          {
            type: "text",
            text: `Logarithm (base ${b}): ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating logarithm: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }

  async handleAverage(a: number, b: number) {
    try {
      this.validateNumericInputs(a, b);

      const result = (a + b) / 2;

      // Check for potential overflow
      if (!isFinite(result)) {
        throw new Error("Result is too large or not a valid number");
      }

      return {
        content: [
          {
            type: "text",
            text: `Average: ${result}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating average: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
        isError: true,
      };
    }
  }
  
  async handleStandardDeviation(values: number[], type: 'population' | 'sample' = 'population') {
    try {
      // Validate that values is an array
      if (!Array.isArray(values)) {
        throw new Error("Values must be an array of numbers");
      }
      
      // Validate each value is a number
      for (let i = 0; i < values.length; i++) {
        if (typeof values[i] !== "number" || !isFinite(values[i])) {
          throw new Error(`Value at index ${i} must be a finite number`);
        }
      }
      
      // Need at least 1 value for population std dev, 2 for sample
      if (values.length === 0) {
        throw new Error("Array of values cannot be empty");
      }
      
      if (type === 'sample' && values.length < 2) {
        throw new Error("Sample standard deviation requires at least 2 values");
      }
      
      // Calculate mean
      const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
      
      // Calculate sum of squared differences from the mean
      const squaredDifferences = values.map(value => Math.pow(value - mean, 2));
      const sumOfSquaredDifferences = squaredDifferences.reduce((sum, value) => sum + value, 0);
      
      // Calculate standard deviation
      let standardDeviation: number;
      
      if (type === 'population') {
        standardDeviation = Math.sqrt(sumOfSquaredDifferences / values.length);
      } else { // sample
        standardDeviation = Math.sqrt(sumOfSquaredDifferences / (values.length - 1));
      }
      
      return {
        content: [
          {
            type: "text",
            text: `${type === 'population' ? 'Population' : 'Sample'} Standard Deviation: ${standardDeviation}`,
          },
        ],
        isError: false,
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating standard deviation: ${
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
