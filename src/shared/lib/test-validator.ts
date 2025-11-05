import { validator } from "./validator.ts";

const moves = [1, 2, 1, 2, 1, 2, 1];

console.log(JSON.stringify(validator(moves), null, 2));