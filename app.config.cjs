module.exports = {
  apps: [{
    name: "stock_backend",
    script: "./app.js",
    watch: true,
    ignore_watch: ["node_modules", "logs", ".git", "test/report"],
    // error_file: `./logs/err.log`,
    // out_file: `./logs/appName-plugin.log`,
    // log_date_format: "YYYY-MM-DD HH:mm:ss.SSS",
    exp_backoff_restart_delay: 100,
    autorestart: true,
    combine_logs: true,
    merge_logs: true
  }]
}
