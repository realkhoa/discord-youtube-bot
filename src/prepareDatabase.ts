import { prepareTables } from "./utils/db";

(async () => {
  console.log("CREATING DATABASE");
  await prepareTables();
})();
