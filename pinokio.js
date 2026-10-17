module.exports = {
  version: "8.0.0",
  title: "SDCodex",
  description: "Local model library, Civitai explorer, download manager, and plugin hub.",
  menu: async (kernel, info) => {
    const installed = info.exists("app/backend/sdcodex/static/index.html");
    const running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js"),
      config: info.running("config.js")
    };

    if (running.install) {
      return [{ default: true, icon: "fa-solid fa-plug", text: "Installing", href: "install.js" }];
    }
    if (running.update) {
      return [{ default: true, icon: "fa-solid fa-rotate", text: "Updating", href: "update.js" }];
    }
    if (running.reset) {
      return [{ default: true, icon: "fa-solid fa-rotate-left", text: "Resetting", href: "reset.js" }];
    }
    if (running.config) {
      return [{ default: true, icon: "fa-solid fa-gear", text: "Saving settings", href: "config.js" }];
    }
    if (!installed) {
      return [{ default: true, icon: "fa-solid fa-plug", text: "Install", href: "install.js" }];
    }
    if (running.start) {
      const local = info.local("start.js");
      if (info.ready("start.js") && local && local.url) {
        return [
          { default: true, icon: "fa-solid fa-rocket", text: "Open SDCodex", href: local.url },
          { icon: "fa-solid fa-terminal", text: "Terminal", href: "start.js" },
          { icon: "fa-solid fa-gear", text: "Configure", href: "config.js" },
          { icon: "fa-solid fa-rotate", text: "Update", href: "update.js" }
        ];
      }
      return [{ default: true, icon: "fa-solid fa-terminal", text: "Starting", href: "start.js" }];
    }
    return [
      { default: true, icon: "fa-solid fa-power-off", text: "Start", href: "start.js" },
      { icon: "fa-solid fa-gear", text: "Configure", href: "config.js" },
      { icon: "fa-solid fa-rotate", text: "Update", href: "update.js" },
      { icon: "fa-solid fa-rotate-left", text: "Reset", href: "reset.js" }
    ];
  }
};
