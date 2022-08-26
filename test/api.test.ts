import request from "supertest";
import app from "../server";

/* STORE API*/

//POST

describe("POST /store", () => {
    it("POST /store should return 200 OK", async () => {
        const res = await request(app).post("/store").send({ "username": "admin", "item_id": "387", "price": 3.14 })
        expect(res.body).toEqual({ message:`item stored 387`});
    });
});

describe("POST /store", () => {
    it("POST /store should return 200 OK", () => {
        return request(app).post("/store").send({ "username": "admin", "item_id": "567", "price": 2 })
            .expect(200);
    });
});

describe("POST /store", () => {
    it("POST /store should return 200 OK", () => {
        return request(app).post("/store").send({ "username": "admin", "item_id": "123", "price": 2 })
            .expect(200);
    });
});

describe("POST /store with wrong type", () => {
    it("POST /store should return 400 Bad Request", () => {
        return request(app).post("/store").send({ "username": "admin", "item_id": "387", "price": "3.14" })
            .expect(400);
    });
});

describe("POST /store without username admin", () => {
    it("POST /store should return 401 Unauthorized", () => {
        return request(app).post("/store").send({ "username": "dana", "item_id": "387", "price": 3.14 })
            .expect(401);
    });
});

//PUT

describe("PUT /store", () => {
    it("PUT /store should return 200 OK", () => {
        return request(app).put("/store").send({ "username": "admin", "item_id": "387", "amount": 10 })
            .expect(200);
    });
});

describe("PUT /store", () => {
    it("PUT /store should return 200 OK", () => {
        return request(app).put("/store").send({ "username": "admin", "item_id": "123", "add": 10 })
            .expect(200);
    });
});

describe("PUT /store with non exist item", () => {
    it("PUT /store should return 400 Bad Request", () => {
        return request(app).put("/store").send({ "username": "admin", "item_id": "678", "add": 3.14 })
            .expect(400);
    });
});

describe("PUT /store without username admin", () => {
    it("PUT /store should return 401 Unauthorized", () => {
        return request(app).put("/store").send({ "username": "dana", "item_id": "387", "amount": 10 })
            .expect(401);
    });
});

//GET 

describe("GET /store", () => {
    it("GET /store should return 200 OK", () => {
        return request(app).get("/store").send({username:"admin"})
            .expect(200);
    });
});

describe("GET /store without username admin", () => {
    it("GET /store should return 401 Unauthorized", () => {
        return request(app).get("/store").expect(401).send({username:"dana"});
    });
});

/* CLIENTS API*/

//POST

describe("POST /clients", () => {
    it("POST /clients should return 200 OK", () => {
        return request(app).post("/clients").send({ "username": "mike", "item_id": "387", "quantity": 2 })
            .expect(200);
    });
});

describe("POST /clients", () => {
    it("POST /clients should return 200 OK", () => {
        return request(app).post("/clients").send({ "username": "dana", "item_id": "387", "quantity": 1 })
            .expect(200);
    });
});

describe("POST /clients", () => {
    it("POST /clients should return 200 OK", () => {
        return request(app).post("/clients").send({ "username": "dana", "item_id": "123", "quantity": 3 })
            .expect(200);
    });
});

describe("POST /clients with non exist item", () => {
    it("POST /clients should return 400 Bad Request", () => {
        return request(app).post("/clients").send({ "username": "mike", "item_id": "789", "quantity": 2 })
            .expect(400);
    });
});

describe("POST /clients with wrong type", () => {
    it("POST /clients should return 400 Bad Request", () => {
        return request(app).post("/clients").send({ "username": "mike", "item_id": 387, "quantity": 2 })
            .expect(400);
    });
});

describe("POST /clients the item_id is smaller than the requested quantity", () => {
    it("POST /clients should return 400 Bad Request", () => {
        return request(app).post("/clients").send({ "username": "mike", "item_id": "567", "quantity": 2 })
            .expect(400);
    });
});

describe("POST /clients/purchase", () => {
    it("POST /clients/purchase should return 200 OK", () => {
        return request(app).post("/clients/purchase").send({ "username": "mike" }).expect(200);
    });
});


//DELETE

describe("DELETE /clients", () => {
    it("`DELETE` /clients should return 200 OK", () => {
        return request(app).delete("/clients").send({ "username": "dana", "item_id": "387" })
            .expect(200);
    });
});

