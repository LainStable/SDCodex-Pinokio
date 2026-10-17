module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        path: ".",
        message: "git pull --ff-only"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app",
        message: "git pull --ff-only"
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "backend/env",
        path: "app",
        message: "uv pip install -r backend/requirements.txt"
      }
    },
    {
      method: "shell.run",
      params: {
        path: "app/app",
        message: [
          "npm ci",
          "npm run build -- --outDir ../backend/sdcodex/static --emptyOutDir"
        ]
      }
    }
  ]
};
