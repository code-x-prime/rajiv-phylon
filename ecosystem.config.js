module.exports = {
    apps: [
        {
            name: "rajiv-client",
            cwd: "./client",
            script: "npm",
            args: "run start",
            env: {
                PORT: 3000,
            },
        },
        {
            name: "rajiv-admin",
            cwd: "./admin",
            script: "npm",
            args: "run preview",
            env: {
                PORT: 4173,
            },
        },
        {
            name: "rajiv-server",
            cwd: "./server",
            script: "npm",
            args: "run dev",
            env: {
                PORT: 4000,
                NODE_ENV: "production",
                CORS_ORIGIN:
                    "https://www.rajivphylon.com,https://rajivphylon.com,https://admin.rajivphylon.com,https://www.admin.rajivphylon.com",
            },
        },
    ],
};