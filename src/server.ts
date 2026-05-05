import app from "./app";
import envConfig from "./config/route.config";
import { prisma } from "./lib/prisma";

const port = envConfig.PORT || 5000;

async function server() {
    try {
        await prisma.$connect();
        console.log("Connected to the db successfully");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

server();
