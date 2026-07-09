/**
 * The mark broken into its four petals, in two drawings: `petals` are the open
 * outlines used by the watermarks, `solidPetals` the filled shapes used by the
 * splash. They come from different source exports at different scales, hence
 * two coordinate spaces rather than one.
 *
 * The source files each carry their own tight viewBox, so they have to be
 * placed on a shared canvas. Every petal has exactly one sharp 90-degree
 * corner - the point where it meets the centre of the mark - and its two
 * straight edges face inward. That corner is what fixes its quadrant:
 *
 *   top-left     corner at (291.94, 291.97)   tail runs right along the top
 *   top-right    corner at (  2.50, 291.97)
 *   bottom-left  corner at (291.94,   2.50)
 *   bottom-right corner at (  2.50,  79.49)   tail runs up along the right
 *
 * Each petal is translated so its corner lands 20 units off the shared centre
 * (311.94, 311.97), which opens the 40-unit seam the mark is drawn with. The
 * offsets check out: the two bottom petals independently land on the same
 * baseline at y=624.48.
 *
 * `lean` is the direction the petal shifts on hover: toward the shared centre.
 * Outward would push it past the edge of the `overflow-hidden` parent it bleeds
 * out of, and the petal would be sliced off mid-hover. Inward always has room -
 * the 40-unit seam absorbs it, and only one petal is ever hovered at a time.
 */
export const PETAL_VIEWBOX = "0 0 624 627";

export const petals = [
  {
    id: "top-left",
    transform: "translate(0 0)",
    lean: { x: 1, y: 1 },
    d: "M134.46,2.5c-79.56,0-131.96,67.86-131.96,148.18v1.88c.41,39.34,13.47,73.96,36.09,98.83,22.96,25.24,55.9,40.58,95.87,40.58h157.48v-162.51c0-60.49,33.39-111.3,87.16-126.96h-244.64Z",
  },
  {
    id: "top-right",
    transform: "translate(329.44 0)",
    lean: { x: -1, y: 1 },
    d: "M147.23,2.5C67.3,2.5,2.5,67.3,2.5,147.23v144.74h144.73c79.92,0,144.71-64.81,144.71-144.74,0-79.31-63.78-143.71-142.84-144.72h-1.87Z",
  },
  {
    id: "bottom-left",
    transform: "translate(0 329.47)",
    lean: { x: 1, y: -1 },
    d: "M147.57,2.5C67.71,2.5,2.5,70.3,2.5,150.29c0,79.93,64.79,144.72,144.71,144.73,79.92,0,144.72-64.8,144.73-144.73V2.5s-144.36,0-144.36,0Z",
  },
  {
    id: "bottom-right",
    transform: "translate(329.44 252.48)",
    lean: { x: -1, y: -1 },
    d: "M291.94.75c-6.73,21.56-19.62,38.89-36.77,51.74-23.89,17.9-55.92,27-90.88,27H2.5v147.79c0,79.93,64.8,144.73,144.73,144.73,79.92,0,144.71-64.8,144.71-144.73V.75Z",
  },
];

/**
 * The filled petals, on the original 263-unit logo canvas - the same box
 * `logoPath.js` draws in, so the assembled petals overlay the one-path logo
 * exactly. Corners land on the seam at x 122.72/140.25, y 122.73/139, verified
 * by rasterizing the composition against the original mark.
 *
 * Listed clockwise from top-left; entrance staggers follow array order.
 */
export const solidPetals = [
  {
    id: "top-left",
    transform: "translate(0 0)",
    lean: { x: 1, y: 1 },
    d: "M169.47.11c-28.35,1.78-46.75,25.04-46.75,53.85v68.78H56.04C22.16,122.74,0,96.7,0,62.81,0,28.91,22.16,0,56.04,0h109.76c1.23,0,2.45.04,3.66.11Z",
  },
  {
    id: "top-right",
    transform: "translate(140.25 0)",
    lean: { x: -1, y: 1 },
    d: "M61.36,0C27.48,0,0,27.47,0,61.36v61.37h61.36c33.89,0,61.36-27.48,61.36-61.37C122.72,27.47,95.25,0,61.36,0Z",
  },
  {
    id: "bottom-right",
    transform: "translate(140.25 91.7)",
    lean: { x: -1, y: -1 },
    d: "M122.72,3.94c-1.78,28.35-25.45,43.36-54.25,43.36H0v62.64c0,33.89,27.48,61.36,61.36,61.36,33.89,0,61.36-27.47,61.36-61.36V.16c0-1.23.07,4.99,0,3.78Z",
  },
  {
    id: "bottom-left",
    transform: "translate(0 139)",
    lean: { x: 1, y: -1 },
    d: "M61.36,124c33.89,0,61.36-27.47,61.36-61.36V0h-61.21C27.62,0,0,28.75,0,62.64c0,33.89,27.47,61.36,61.36,61.36Z",
  },
];
