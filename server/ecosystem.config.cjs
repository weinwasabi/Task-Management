module.exports = {
  apps: [
    {
      name: "task-management",
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
