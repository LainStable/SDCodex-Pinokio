module.exports = {
  run: [
    {
      when: "{{!exists('app/.git')}}",
      method: "shell.run",
      params: {
        message: "git clone https://github.com/LainStable/SDCodex.git app"
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
