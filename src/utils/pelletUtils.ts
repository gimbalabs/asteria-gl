import Papa from 'papaparse';

export type Coordinates = Array<{ pos_x: number; pos_y: number }>;
export type PelletParams = Array<{ fuel: number; pos_x: number; pos_y: number; shipyard_policy: string }>;

// Utility function to get a random subarray
export function getRandomSubarray<T>(arr: Array<T>, size: number) {
    const shuffled = arr.slice(0);
    let i = arr.length,
      temp,
      index;
    while (i--) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index]!;
      shuffled[index] = shuffled[i]!;
      shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
  }

/**
 * Returns an array with the coordinates of the points that lie in the
 * area between two circles with radii inner_r and outer_r respectively.
 */
export function getRingAreaCoordinates(inner_r: number, outer_r: number): Coordinates {
    if (inner_r < 0 || inner_r > outer_r) {
      throw Error(
        "inner_r must be a positive number less than or equal to outer_r"
      );
    }
    const x_bound = Math.floor(outer_r);
    const xs = Array.from({ length: 2 * x_bound + 1 }, (_, i) => i - x_bound);
    const coordinates = xs.map((x) => {
      const y_outer_bound = Math.floor(Math.sqrt(outer_r ** 2 - x ** 2));
      let ys = Array.from(
        { length: 2 * y_outer_bound + 1 },
        (_, i) => i - y_outer_bound
      );
      if (Math.abs(x) < Math.abs(inner_r)) {
        const y_inner_bound = Math.floor(Math.sqrt(inner_r ** 2 - x ** 2));
        ys = ys.filter((y) => Math.abs(y) > y_inner_bound);
      }
      return ys.map((y) => ({ pos_x: Number(x), pos_y: Number(y) }));
    });
    return coordinates.flat();
  }  

  
/**
 * Returns an array with a random sample of pellet parameters over the area
 * between two circles with radii inner_r and outer_r respectively.
 */
export function getRingAreaSample(
    inner_r: number,
    outer_r: number,
    min_fuel: number,
    max_fuel: number,
    density: number,
    shipyard_policy: string = ""
  ): PelletParams {
    const coordinates = getRingAreaCoordinates(inner_r, outer_r);
    const densityBasedSize = Math.floor(coordinates.length * density);
    const sample_size = Math.min(densityBasedSize, 100);
    const sample_coordinates = getRandomSubarray(coordinates, sample_size);
    const pellets = sample_coordinates.map((c) => ({
      fuel: Math.floor(
        Math.random() * Number(max_fuel - min_fuel) + Number(min_fuel)
      ),
      pos_x: c.pos_x,
      pos_y: c.pos_y,
      shipyard_policy
    }));
    return pellets;
  }

// Convert pellet params to CSV string
export function pelletsToCSV(pellets: PelletParams): string {
    // Convert BigInt to string for CSV
    const data = pellets.map(p => ({
      fuel: p.fuel,
      pos_x: p.pos_x.toString(),
      pos_y: p.pos_y.toString(),
      shipyard_policy: p.shipyard_policy
    }));
    
    return Papa.unparse(data, {
      header: true
    });
  }

// Parse a CSV string into pellet params
export function parsePelletsCSV(csvString: string): PelletParams {
    const parseResult = Papa.parse(csvString, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
    
    return parseResult.data.map((row: any) => {
      // Check if pos_x/x and pos_y/y exist and have valid values
      const posX = row.pos_x !== undefined ? row.pos_x : row.x;
      const posY = row.pos_y !== undefined ? row.pos_y : row.y;
      
      if (posX === undefined || posY === undefined) {
        throw new Error("CSV must contain either 'pos_x' and 'pos_y' or 'x' and 'y' columns with valid values");
      }
      
      return {
        fuel: Number(row.fuel || 0),
        pos_x: Number(posX),
        pos_y: Number(posY),
        shipyard_policy: row.shipyard_policy || ""
      };
    });
  }  