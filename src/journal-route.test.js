const express = require("express");
const bodyParser = require("body-parser");
const journalRoutes = require("./journal-route");
const save = require("./lib");
const request = require("supertest");

jest.mock("./lib", () => jest.fn());

jest.mock("../data/dailyJournals.json", () => ({
  "1": {
    id: 1,
    title: "ttttt",
    content: "ttttttttttttttt",
    createdAt: "2019-07-18T06:44:29.192Z",
    updatedAt: "2019-07-18T06:44:29.192Z",
    isDeleted: false
  },
  "2": {
    id: 2,
    title: "uuuuuuuuuuuu",
    content: "uuuuuuuuuuuuuuuuuuuuuuuuu",
    createdAt: "2019-07-18T07:21:48.569Z",
    updatedAt: "2019-07-18T07:21:48.569Z",
    isDeleted: false
  }
}));

const app = express();
app.use(bodyParser.json());

app.use("/journal", journalRoutes);

describe("journal-routes", () => {
  it("GET /journal - success", async () => {
    const { body } = await request(app).get("/journal");
    expect(body).toEqual([
      {
        id: 1,
        title: "ttttt",
        content: "ttttttttttttttt",
        createdAt: "2019-07-18T06:44:29.192Z",
        updatedAt: "2019-07-18T06:44:29.192Z",
        isDeleted: false
      },
      {
        id: 2,
        title: "uuuuuuuuuuuu",
        content: "uuuuuuuuuuuuuuuuuuuuuuuuu",
        createdAt: "2019-07-18T07:21:48.569Z",
        updatedAt: "2019-07-18T07:21:48.569Z",
        isDeleted: false
      }
    ]);
  });

  it("DELETE /journal/1 - success", async () => {
    const { body } = await request(app).delete("/journal/1");
    expect(body).toEqual({
      status: "deleted"
    });
    expect(save).toHaveBeenCalledWith({
      "1": {
        id: 1,
        title: "ttttt",
        content: "ttttttttttttttt",
        createdAt: "2019-07-18T06:44:29.192Z",
        updatedAt: "2019-07-18T06:44:29.192Z",
        isDeleted: true
      },
      "2": {
        id: 2,
        title: "uuuuuuuuuuuu",
        content: "uuuuuuuuuuuuuuuuuuuuuuuuu",
        createdAt: "2019-07-18T07:21:48.569Z",
        updatedAt: "2019-07-18T07:21:48.569Z",
        isDeleted: false
      }
    });
  });

  it("DELETE /journal/3 - fails when journal is not found", async () => {
    const { body, status } = await request(app).delete("/journal/3");
    expect(status).toEqual(404);
    expect(body).toEqual({
        message: "Journal Not Found"
    });
  });

  it("GET /journal/2 - success", async () => {
    const { body } = await request(app).get("/journal/2");
    expect(body).toEqual({
      id: 2,
      title: "uuuuuuuuuuuu",
      content: "uuuuuuuuuuuuuuuuuuuuuuuuu",
      createdAt: "2019-07-18T07:21:48.569Z",
      updatedAt: "2019-07-18T07:21:48.569Z",
      isDeleted: false
    });
  });

  it("POST /journal - success", async () => {
    const req = {
      title: "vvvvvvvvv",
      content: "vvvvvvvvvvvvvvvvvvvv"
    };

    const { body } = await request(app)
      .post("/journal")
      .send(req);
    expect(body.id).toEqual(3);
    expect(body.title).toEqual(req.title);
    expect(body.content).toEqual(req.content);
    expect(body.isDeleted).toEqual(false);
  });

  it("POST /journal - fails when title is not supplied", async () => {
    const req = {
      title: "",
      content: "vvvvvvvvvvvvvvvvvvvv"
    };

    const { body, status } = await request(app)
      .post("/journal")
      .send(req);
    expect(status).toEqual(400);
    expect(body).toEqual({
      message: "The title is required."
    });
  });

  it("POST /journal - fails when content is not supplied", async () => {
    const req = {
      title: "zzzzzzzz",
      content: ""
    };

    const { body, status } = await request(app)
      .post("/journal")
      .send(req);
    expect(status).toEqual(400);
    expect(body).toEqual({
      message: "The content is required."
    });
  });

  it("PUT /journal - success", async () => {
    const req = {
      title: "xxxxxxxxxxx",
      content: "xxxxxxxxxxxxxxxxxxx"
    };

    const { body, status } = await request(app)
      .put("/journal/2")
      .send(req);
    expect(status).toEqual(200);
    expect(body.title).toEqual(req.title);
    expect(body.content).toEqual(req.content);
    expect(body.updatedAt).not.toEqual("2019-07-18T07:21:48.569Z");
  });

  it("PUT /journal - fails when title is not supplied", async () => {
    const req = {
      title: "",
      content: "vvvvvvvvvvvvvvvvvvvv"
    };

    const { body, status } = await request(app)
      .put("/journal/2")
      .send(req);
    expect(status).toEqual(400);
    expect(body).toEqual({
      message: "The title is required."
    });
  });

  it("PUT /journal - fails when content is not supplied", async () => {
    const req = {
      title: "zzzzzzzz",
      content: ""
    };

    const { body, status } = await request(app)
      .put("/journal/2")
      .send(req);
    expect(status).toEqual(400);
    expect(body).toEqual({
      message: "The content is required."
    });
  });
});
