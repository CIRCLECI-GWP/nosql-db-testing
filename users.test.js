const { MongoClient } = require("mongodb");
const { faker } = require("@faker-js/faker");

jest.setTimeout(30000);

const uri =
  "mongodb+srv://cciuser:DpgBTlQm3EaC1HKS@cluster0.ei7z4x6.mongodb.net/?retryWrites=true&w=majority";
  // "mongodb+srv://YOUR_DB_USER:YOUR_DB_PASSWORD@YOUR_DB_HOST/?retryWrites=true&w=majority";

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

  test("Test READ", async () => {
    let sampleUser = { name: "Test User", email: "test@user.com" };

    await usersCollection.insertOne(sampleUser);

    const findUser = await usersCollection.findOne({ email: sampleUser.email });

    expect(findUser.name).toBe(sampleUser.name);
  }, 30000);

  afterEach(async () => {
    await usersCollection.deleteMany({});
  });

  afterAll(async () => {
    await client.close();
  });
});
