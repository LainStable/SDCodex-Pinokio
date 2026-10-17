const fs = require("fs/promises");
const path = require("path");

module.exports = async (kernel) => {
  let settings = { port: 5000, host: "127.0.0.1" };
  try {
    const saved = JSON.parse(
      await fs.readFile(path.join(__dirname, "runtime-settings.json"), "utf8")
    );
    if (!Number.isInteger(saved.port) || saved.port < 1 || saved.port > 65535) {
      throw new Error("Configured port must be between 1 and 65535.");
    }
    if (saved.host !== "127.0.0.1" && saved.host !== "0.0.0.0") {
      throw new Error("Configured bind address is invalid.");
    }
    settings = saved;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  return {
    daemon: true,
    run: [
      {
        method: "shell.run",
        params: {
          venv: "env",
          path: "app/backend",
          message: `HOST=${settings.host} PORT=${settings.port} python run.py`,
          on: [{
            event: "/(http:\\/\\/[0-9.:]+)/",
            done: true
          }]
        }
      },
      {
        method: "local.set",
        params: {
          url: "{{input.event[0]}}"
        }
      }
    ]
  };
};
