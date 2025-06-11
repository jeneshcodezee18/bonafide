import request from "supertest";
import app from "../src/app";

describe("GET /", () => {
  test("server started", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});

describe("POST /login", () => {
  test("should return a login user details", async () => {
    const reqData = {
      "username": "hardik",
      "password": "124"
    };
    const respData = {
      "username": 'hardik',
      "password": 'c8ffe9a587b126f152ed3d89a146b445'
    };
    const res = await request(app).post("/login").send(reqData);
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe(respData.username);
    expect(res.body.password).toBe(respData.password);
  });
});

describe("POST /user/create", () => {
  test("should return a created user details", async () => {
    const reqData = {
      "username": "Dharmik",
      "user_email": "dharmik.codezee@gmail.com",
      "password": "123"
    };
    const respData = {
      "username": 'Dharmik',
      "password": '202cb962ac59075b964b07152d234b70'
    };
    const res = await request(app).post("/user/create").send(reqData);
    expect(res.body.status).toBe(200);
    expect(res.body.err).toBe(0);
    expect(res.body.data.username).toBe(respData.username);
    expect(res.body.data.password).toBe(respData.password);
  });

  test("should return a status 400 if username not entered", async () => {
    const reqData = {
      "password": "123"
    };
    const respData = {
      "password": '202cb962ac59075b964b07152d234b70'
    };
    const res = await request(app).post("/user/create").send(reqData);
    expect(res.body.status).toBe(400);
    expect(res.body.err).toBe(1);
    expect(res.body.msg).toBe('User not created');
  });
  
  test("should return a status 400 if password not entered", async () => {
    const reqData = {
      "username": "Dharmik"
    };
    const respData = {
      "username": 'Dharmik'
    };
    const res = await request(app).post("/user/create").send(reqData);
    expect(res.body.status).toBe(400);
    expect(res.body.err).toBe(1);
    expect(res.body.msg).toBe('User not created');
  });
});