const fs = require("fs/promises");
const path = require("path");

const SETTINGS_FILE = "runtime-settings.json";
const DEFAULT_SETTINGS = { port: 5000, host: "127.0.0.1" };

module.exports = async (kernel) => {
  let settings = DEFAULT_SETTINGS;
  try {
    const saved = JSON.parse(
      await fs.readFile(path.join(__dirname, SETTINGS_FILE), "utf8")
    );
    if (!Number.isInteger(saved.port) || saved.port < 1 || saved.port > 65535) {
      throw new Error("Saved port must be a whole number between 1 and 65535.");
    }
    if (saved.host !== "127.0.0.1" && saved.host !== "0.0.0.0") {
      throw new Error("Saved bind address is invalid.");
    }
    settings = saved;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  return {
    run: [
      {
        method: "input",
        params: {
          title: "SDCodex network settings",
          description: "Choose the fixed port and network address for SDCodex. Stop and start the app after saving changes.",
          form: [
            {
              key: "port",
              title: "Port",
              description: "TCP port used by SDCodex and your reverse proxy.",
              default: String(settings.port),
              placeholder: "5000"
            },
            {
              type: "select",
              key: "host",
              title: "Bind address",
              description: "Use loopback unless a reverse proxy on another machine must connect. Binding to all interfaces exposes this app to reachable networks; secure it with your firewall and proxy.",
              default: settings.host,
              items: [
                { text: "127.0.0.1 — this machine only (Recommended)", value: "127.0.0.1" },
                { text: "0.0.0.0 — all network interfaces", value: "0.0.0.0" }
              ]
            }
          ]
        }
      },
      {
        method: async (req) => {
          const input = req.input || {};
          const portText = String(input.port ?? "").trim();
          if (!/^\d+$/.test(portText)) {
            throw new Error("Port must be a whole number between 1 and 65535.");
          }
          const port = Number(portText);
          if (!Number.isSafeInteger(port) || port < 1 || port > 65535) {
            throw new Error("Port must be a whole number between 1 and 65535.");
          }
          const host = input.host;
          if (host !== "127.0.0.1" && host !== "0.0.0.0") {
            throw new Error("Choose a supported bind address.");
          }
          await fs.writeFile(
            path.join(req.cwd, SETTINGS_FILE),
            `${JSON.stringify({ port, host }, null, 2)}\n`,
            { mode: 0o600 }
          );
          return { port, host };
        }
      },
      {
        method: "notify",
        params: {
          html: "SDCodex network settings saved. Stop and start the app to apply them."
        }
      }
    ]
  };
};
