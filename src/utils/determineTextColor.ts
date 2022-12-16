const determineTextColor = (hexCode: string): ("white" | "black") => {
    // Check if the input is a valid hex color code
    if (!/^#([0-9A-Fa-f]{3}){1,2}$/.test(hexCode)) {
      throw new Error("Invalid hex color code")
    }

    let r: number, g: number, b: number;
  
    if (hexCode.length === 4) {
        // Hex color code is in the format #RGB
        r = parseInt(hexCode.substring(1, 2) + hexCode.substring(1, 2), 16);
        g = parseInt(hexCode.substring(2, 3) + hexCode.substring(2, 3), 16);
        b = parseInt(hexCode.substring(3, 4) + hexCode.substring(3, 4), 16);
      } else {
        // Hex color code is in the format #RRGGBB
        r = parseInt(hexCode.substring(1, 3), 16);
        g = parseInt(hexCode.substring(3, 5), 16);
        b = parseInt(hexCode.substring(5, 7), 16);
      }

    // Convert the RGB values to YIQ values for easier contrast calculation
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
    // If the YIQ value is less than 128, the color has a higher contrast with white,
    // otherwise it has a higher contrast with black
    if (yiq <= 128) {
      return "white";
    } else {
      return "black"
    }
  }
  
export default determineTextColor
