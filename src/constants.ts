// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
// const pkg = require("../package.json") as {
//   name: string;
//   version: string;
//   description: string;
// };
import pkg from "../package.json";

export const NAME = pkg.name;
export const VERSION = pkg.version;
export const DESCRIPTION = pkg.description;

export const REGISTRY_BASE =
  "https://raw.githubusercontent.com/nyanxx/sui-registry/main";
export const REGISTRY_URL = `${REGISTRY_BASE}/registry.json`;
