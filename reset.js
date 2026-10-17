module.exports = {
  run: [
    {
      method: "fs.rm",
      params: {
        path: "app/backend/env"
      }
    },
    {
      method: "fs.rm",
      params: {
        path: "app/app/node_modules"
      }
    },
    {
      method: "fs.rm",
      params: {
        path: "app/backend/sdcodex/static"
      }
    }
  ]
};
