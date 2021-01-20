const pgp = require("pg-promise")();
const path = require("path");
const { QueryFile } = require("pg-promise");
const dbConfig = require("./config");

const seedIfEmpty = async () => {
  const db = pgp(dbConfig);

  const results = await db.manyOrNone("SELECT * FROM product");

  if (results.length === 0) {
    console.log("Database seeded");
    const dump = new QueryFile(path.join(__dirname, "schema.sql"), {
      params: { external: true },
      minify: true,
    });

    await db.any(dump);
  } else {
    console.log("Database already seeded");
  }

  await db.$pool.end();
};

seedIfEmpty();
