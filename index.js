import express from "express";
import bodyParser from "body-parser";
import "dotenv/config";
import pg from "pg";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client(process.env.DATABASE_URL);
db.connect();

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Buy cat food" },
];

app.get("/", async (req, res) => {
  try {
    const results = await db.query("SELECT * FROM items");
    items = results.rows;
    res.render("index.ejs", {
      listTitle: "Today",
      listItems: items,
    });
  } catch (err) {
    console.error(err);
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  if (req.body.newItem !== "") {
    try {
      await db.query("INSERT INTO items (title) VALUES ($1)", [item]);
    } catch (err) {
      console.error(err);
    }
  }
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  var editedTitle = req.body.updatedItemTitle;
  var idOfEdited = req.body.updatedItemId;
  try {
    await db.query("UPDATE items SET title=$1 WHERE id=$2", [
      editedTitle,
      idOfEdited,
    ]);
    res.redirect("/");
  } catch (err) {
    console.error(err);
  }
});

app.post("/delete", async (req, res) => {
  var idOfDeleting = req.body.deleteItemId;
  try {
    await db.query("DELETE FROM items WHERE id=$1", [idOfDeleting]);
  } catch (err) {
    console.error(err);
  }
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
