const assert = require("assert");
const { response } = require("express");

describe("end-to-end", () => {
  const { app, db } = require("./server");
  const httpc = require("http");
  const HTTP_PORT = process.env.APP_PORT || 8000;

  const baseOptions = {
    hostname: "localhost",
    port: HTTP_PORT,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  };

  var server;

  before(() => {
    server = app.listen(HTTP_PORT);
  });

  beforeEach(async () => {
    try {
      await db.none("DELETE FROM customer");
      await db.none("DELETE FROM product");
      await db.none("DELETE FROM public.order");
    } catch (error) {
      console.log(error);
    }
  });

  after(() => {
    server.close();
    process.exit(0);
  });

  afterEach(async () => {
    try {
      await db.none("DELETE FROM product");
      await db.none("DELETE FROM public.order");
      await db.none("DELETE FROM customer");
    } catch (error) {
      console.log(error);
    }
  });

  it("should get products", async () => {
    try {
      await db.none(
        "INSERT INTO product(product_name, image_path, price) VALUES('Test #1', 'https://images.unsplash.com/', 10);"
      );
      await db.none(
        "INSERT INTO product(product_name, image_path, price) VALUES('Test #2', 'https://images.unsplash.com/', 20);"
      );
      await db.none(
        "INSERT INTO product(product_name, image_path, price) VALUES('Test #3', 'https://images.unsplash.com/', 30);"
      );
    } catch (error) {
      console.log(error);
    }

    const options = { ...baseOptions, path: "/products", method: "GET" };

    return new Promise((resolve, reject) => {
      const req = httpc.request(options, (res) => {
        res.on("data", (response) => {
          const data = JSON.parse(response);
          assert.strictEqual(data.length, 3);
          assert.strictEqual(data[0].product_name, "Test #1");
          assert.strictEqual(
            data[0].image_path,
            "https://images.unsplash.com/"
          );
          assert.strictEqual(data[0].price, 10);
          assert.strictEqual(data[1].product_name, "Test #2");
          assert.strictEqual(
            data[1].image_path,
            "https://images.unsplash.com/"
          );
          assert.strictEqual(data[1].price, 20);
          assert.strictEqual(data[2].product_name, "Test #3");
          assert.strictEqual(
            data[2].image_path,
            "https://images.unsplash.com/"
          );
          assert.strictEqual(data[2].price, 30);

          resolve(null);
        });
      });

      req.end();
    });
  });

  it("should post an order", async () => {
    try {
      const { id: productId } = await db.one(
        "INSERT INTO product(product_name, image_path, price) VALUES('Test #1', 'https://images.unsplash.com/', 10) returning id;"
      );

      const address = {
        name: "Test Name",
        street: "Test Street",
        streetNumber: "Test Number",
        city: "Test City",
        postcode: "Test Postcode",
      };

      const cart = {
        [productId]: {
          id: productId,
          count: 10,
        },
      };

      const data = { cart, address };

      const options = {
        ...baseOptions,
        headers: {
          "Content-Type": "application/json",
          "Content-Length": JSON.stringify(data).length,
        },
        path: "/orders",
        method: "POST",
      };

      return new Promise((resolve, reject) => {
        const req = httpc.request(options, (res) => {
          res.on("data", (response) => {
            const data = JSON.parse(response);
            assert.strictEqual(data.orderId > 0, true);
            resolve(null);
          });
        });

        req.write(JSON.stringify(data));
        req.end();
      });
    } catch (error) {
      console.log(error);
    }
  });

  it("should get the orders", async () => {
    try {
      const { id: productId } = await db.one(
        "INSERT INTO product(product_name, image_path, price) VALUES('Test #1', 'https://images.unsplash.com/', 10) returning id;"
      );

      const { id: customerId } = await db.one(
        "INSERT INTO customer(name, street, street_number, city, postcode) VALUES('Test Name', 'Street', 42, 'City', 'Postcode') RETURNING id;"
      );

      const { id: orderId } = await db.one(
        "INSERT INTO public.order(customer_id, status) VALUES(" +
          customerId +
          ", 'NEW') RETURNING id;"
      );

      await db.none(
        "INSERT INTO public.order_product(product_id, order_id, quantity) VALUES(" +
          productId +
          ", " +
          orderId +
          ", 15)"
      );

      const options = {
        ...baseOptions,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        path: "/orders",
        method: "GET",
      };

      return new Promise((resolve, reject) => {
        const req = httpc.request(options, (res) => {
          res.on("data", (response) => {
            const data = JSON.parse(response);

            assert.strictEqual(data.length, 1);
            assert.strictEqual(data[0].id > 0, true);
            assert.strictEqual(data[0].customer.name, "Test Name");
            assert.strictEqual(data[0].customer.street, "Street");
            assert.strictEqual(data[0].customer.streetNumber, "42");
            assert.strictEqual(data[0].customer.city, "City");
            assert.strictEqual(data[0].customer.postcode, "Postcode");
            assert.strictEqual(data[0].status, "NEW");
            assert.strictEqual(data[0].products[0].id > 0, true);
            assert.strictEqual(data[0].products[0].name, "Test #1");
            assert.strictEqual(data[0].products[0].quantity, 15);
            assert.strictEqual(data[0].products[0].price, "10");
            assert.strictEqual(
              data[0].products[0].image_path,
              "https://images.unsplash.com/"
            );

            resolve(null);
          });
        });
        req.end();
      });
    } catch (error) {
      console.log(error);
    }
  });

  it("should get the customers", async () => {
    try {
      await db.none(
        "INSERT INTO customer(name, street, street_number, city, postcode, counter) VALUES('Customer Name', 'Street', 42, 'City', 'Postcode', 15);"
      );

      const options = {
        ...baseOptions,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        path: "/customers",
        method: "GET",
      };

      return new Promise((resolve, reject) => {
        const req = httpc.request(options, (res) => {
          res.on("data", (response) => {
            const data = JSON.parse(response);

            assert.strictEqual(data.length, 1);
            assert.strictEqual(data[0].id > 0, true);
            assert.strictEqual(data[0].name, "Customer Name");
            assert.strictEqual(data[0].street, "Street");
            assert.strictEqual(data[0].street_number, "42");
            assert.strictEqual(data[0].city, "City");
            assert.strictEqual(data[0].postcode, "Postcode");
            assert.strictEqual(data[0].counter, 15);

            resolve(null);
          });
        });
        req.end();
      });
    } catch (error) {
      console.log(error);
    }
  });
});
