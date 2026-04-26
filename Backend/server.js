const app = require("./src/app");
const DBConnect = require("./src/config/DB");

DBConnect();

app.listen(3000, () => {
  console.log("Database is running on port 3000");
});
