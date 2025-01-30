const express = require("express");
const cors = require("cors");
const path = require("path");
const { Faker, de, ru, en, ja } = require("@faker-js/faker");

const port = process.env.PORT || 5000;

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());

function generateBooks(language, seed, likes, reviews, page, count = 20) {
  const faker = new Faker({ locale: [{ en, ru, de, ja }[language]] });
  faker.seed(seed + page);
  return Array.from({ length: count }, () => {
    return {
      isbn: faker.commerce.isbn(),
      title: faker.lorem.words({ min: 1, max: 2 }),
      author: faker.helpers.multiple(() => faker.person.fullName(), {
        count: { min: 1, max: 3 },
      }),
      publisher: `${faker.company.name()}, ${faker.date
        .past({ years: 20 })
        .getFullYear()}`,
      likes: likes,
      reviews: Array.from({ length: reviews }, () => {
        return {
          review: faker.lorem.sentence(),
          name: faker.person.fullName(),
        };
      }),
    };
  });
}

app.post("/books", (req, res) => {
  const { language, seed, likes, reviews, pages, count } = req.body;
  const books = generateBooks(language, seed, likes, reviews, pages, count);
  res.json(books);
});

app.listen(port, () => {
  console.log("Listening...");
});
