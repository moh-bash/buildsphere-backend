const dotenv = require("dotenv");

dotenv.config();

async function createPuter() {

    const { init } = await import("@heyputer/puter.js/src/init.cjs");

    return init(process.env.PUTER_AUTH_TOKEN);

}

module.exports = createPuter;