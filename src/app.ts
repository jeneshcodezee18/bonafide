import express from "express";
import compression from "compression";  // compresses requests
import session from "express-session";
import bodyParser from "body-parser";
import lusca from "lusca";
import flash from "express-flash";
import path from "path";
import ejs from 'ejs';
import passport from "passport";
import cookieParser from "cookie-parser";
import { Pool } from 'pg';
// import Swal from "sweetalert2";
import AWS from 'aws-sdk';
import cors from 'cors';
import { POSTGRES_URI, SESSION_SECRET } from "./util/secrets";
// import * as jQuery from "jquery";


// Create Express server
const app = express();

// Connect to Postgres
const pool = new Pool({
    connectionString: POSTGRES_URI,
});

pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Failed to connect to PostgreSQL:', err));

// Express configuration
app.set("env", process.env.NODE_ENVIRONMENT || "development");
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));


// app.set("view engine", "ejs");
app.engine('html', ejs.renderFile);
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: SESSION_SECRET, cookie: { maxAge: 24 * 60 * 60 * 1000 }, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));


// app.use(express.static(path.join(__dirname, "views")));
app.use(express.static(path.join(__dirname, "views/web")));
app.use(express.static(path.join(__dirname, "views/admin")));
app.use(express.static(path.join(__dirname, "../../uploads")));


app.use(cors());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");

    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    ); 

    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,Content-type,token"
    ); 

    res.setHeader("Access-Control-Allow-Credentials", true);

    next();
});


// export { jQuery, Swal, ObjectId };
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_BUCKET_REGION
});

export default app;
export const s3 = new AWS.S3();
export { pool };

export const BASE_URL: string = "http://localhost:3000/";
import "./settings/admin_url_setting"
import "./settings/web_url_setting"
