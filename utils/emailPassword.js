let EMAIL_PASSWORD = null;
const PASSWORD_FILE = "/home/thetaxgaap/PASSWORD";
const PASSWORD_ENVVAR = 'TAXGAAP_EMAIL_PASSWORD';

try {
    EMAIL_PASSWORD = require("fs").readFileSync(PASSWORD_FILE, "utf8").trim();
} catch (e) {
    if (e.code === 'ENOENT') {
        EMAIL_PASSWORD = process.env[PASSWORD_ENVVAR];
    }
    else {
        throw e;
    }
}
if (!EMAIL_PASSWORD) {
    console.error(`No password found for email -- ${PASSWORD_FILE} was not found or was empty, and envvar ${PASSWORD_ENVVAR} was not set.`)
}

module.exports = { EMAIL_PASSWORD };