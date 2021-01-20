const express = require("express");
const cors = require("cors");
const dbConfig = require("./db/config");
const pgp = require("pg-promise")();
const db = pgp(dbConfig);
const app = express();
const HTTP_PORT = process.env.APP_PORT || 8000;

app.use(cors());
app.use(express.json());
app.use(require("easy-livereload")());

app.listen(HTTP_PORT, "0.0.0.0", () => {
  console.log(`http://localhost:${HTTP_PORT}`);
});

app.get("/products", async (req, res) => {
  try {
    const rows = await db.query("SELECT * FROM product;");
    const products = rows.map((product) => ({
      ...product,
      price: Number(product.price),
    }));
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: "Ooops, something went wrong!" });
  }
});

app.get("/customers", async (req, res) => {
  try {
    const rows = await db.query("SELECT * FROM customer;");
    res.json(rows);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: "Ooops, something went wrong!" });
  }
});

app.post("/customers/:id/counter", async (req, res) => {
  try {
    await db.none("UPDATE customer SET counter=counter + 1 WHERE id=$1", [
      req.params.id,
    ]);
    res.status(204).json();
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: "Ooops, something went wrong!" });
  }
});

async function getOrderById(id) {
  try {
    // get order join customer join product
    const rows = await db.manyOrNone(
      "SELECT * FROM public.order o JOIN customer c ON c.id=o.customer_id JOIN order_product op ON op.order_id=o.id JOIN product p ON p.id=op.product_id WHERE o.id=$1",
      [id]
    );

    if (rows == []) {
      return null;
    } else {
      // get customer
      const customer = {
        id: rows[0].customer_id,
        name: rows[0].name,
        street: rows[0].street,
        streetNumber: rows[0].street_number,
        city: rows[0].city,
        postcode: rows[0].postcode,
      };

      // get products
      const products = rows.map(
        ({ product_name, quantity, product_id, price, image_path }) => ({
          id: product_id,
          product_name: product_name,
          quantity,
          price,
          image_path,
        })
      );

      // get order
      const order = {
        id: rows[0].order_id,
        customer: customer,
        status: rows[0].status,
        created_at: rows[0].created_at,
        products: products,
      };

      return order;
    }
  } catch (error) {
    console.log(error);
  }
}

app.get("/orders", async (req, res) => {
  try {
    // get order join customer join product
    const rows = await db.manyOrNone(
      "SELECT * FROM public.order o JOIN customer c ON c.id=o.customer_id JOIN order_product op ON op.order_id=o.id JOIN product p ON p.id=op.product_id"
    );

    // get unique orders
    let uniqueOrderIds = [];
    for (row of rows) {
      if (!uniqueOrderIds.includes(row.order_id)) {
        uniqueOrderIds.push(row.order_id);
      }
    }

    // group by order 
    let orders = [];
    for (orderId of uniqueOrderIds) {
      const rowsForOrderId = rows.filter(
        ({ order_id }) => order_id == orderId
      );

      const customer = {
        id: rowsForOrderId[0].customer_id,
        name: rowsForOrderId[0].name,
        street: rowsForOrderId[0].street,
        streetNumber: rowsForOrderId[0].street_number,
        city: rowsForOrderId[0].city,
        postcode: rowsForOrderId[0].postcode,
      };

      const products = rowsForOrderId.map(
        ({ product_name, quantity, product_id, price, image_path }) => ({
          id: product_id,
          name: product_name,
          quantity,
          price,
          image_path,
        })
      );

      const order = {
        id: rowsForOrderId[0].order_id,
        customer: customer,
        status: rowsForOrderId[0].status,
        created_at: rowsForOrderId[0].created_at,
        products: products,
      };

      orders.push(order);
    }

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: "Ooops, something went wrong!" });
  }
});

app.post("/orders", async (req, res) => {
  const addressDetails = req.body.address;
  const cart = req.body.cart;

  try {
    let row = await db.oneOrNone("SELECT id FROM customer WHERE name=$1", [
      addressDetails.name,
    ]);

    let userId = (row && row.id) || null;

    // create customer if not already exists
    if (!userId) {
      const data = await db.one(
        "INSERT INTO customer(name, street, street_number, city, postcode) VALUES($1,$2,$3,$4,$5) RETURNING id",
        [
          addressDetails.name,
          addressDetails.street,
          addressDetails.streetNumber,
          addressDetails.city,
          addressDetails.postcode,
        ]
      );

      userId = data.id;
    }

    const {
      id: orderId,
    } = await db.one(
      "INSERT INTO public.order(customer_id, status) VALUES($1,$2) RETURNING id",
      [userId, "NEW"]
    );

    let productIds = Object.keys(cart);

    for (id of productIds) {
      await db.none(
        "INSERT INTO public.order_product(product_id, order_id, quantity) VALUES($1,$2, $3)",
        [id, orderId, cart[id].count]
      );
    }
    res.json({ orderId: orderId });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: "Ooops, something went wrong!" });
  }
});

app.get("/orders/:id", async (req, res) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ error: "Order not found!" });
    } else {
      res.json(order);
    }
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: "Ooops, something went wrong!" });
  }
});

app.patch("/orders/:id", async (req, res) => {
  try {
    await db.none("UPDATE public.order SET status=$1 WHERE id=$2", [
      "PAID",
      req.params.id,
    ]);
    const order = await getOrderById(req.params.id);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500);
    res.json({ error: "Ooops, something went wrong!" });
  }
});

module.exports = {
  app,
  db,
};
