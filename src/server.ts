import errorHandler from "errorhandler";
import app from "./app";

/**
 * Error Handler. Provides full stack
 */

if (process.env.NODE_ENVIRONMENT === "development") {
    app.use(errorHandler());
}

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), () => {
    console.log(
        " App is running at http://15.206.89.254:%d in %s mode",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;
