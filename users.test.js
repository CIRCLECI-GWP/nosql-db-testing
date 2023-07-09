const { MongoClient } = require("mongodb");
const { faker } = require("@faker-js/faker");

jest.setTimeout(30000);

const uri =
  "mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST/?retryWrites=true&w=majority";
  

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

describe("Database Tests", () => {
  let usersCollection;

  beforeAll(async () => {
    try {
      await client.connect();
      const db = client.db("mytestdb");
      usersCollection = db.collection("users");
    } catch (err) {
      console.error("Error connecting to the database:", err);
    }
  });

  test("Test CREATE", async () => {
    let newUsers = [];
    let total_users_to_add = 3;

    for (let i = 0; i < total_users_to_add; i++) {
      newUsers.push({
        name: faker.person.firstName(),
        email: faker.internet.email(),
      });
    }

    const result = await usersCollection.insertMany(newUsers);
    expect(result.insertedCount).toBe(total_users_to_add);
  }, 30000);

  afterEach(async () => {
    await usersCollection.deleteMany({});
  });

  afterAll(async () => {
    await client.close();
  });
});
