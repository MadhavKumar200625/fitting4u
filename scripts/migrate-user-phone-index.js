import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI must be set before running this migration");
}

const collectionName = "users";
const indexName = "phone_1";
const partialFilterExpression = { phone: { $type: "string" } };

try {
  await mongoose.connect(uri, { dbName: "fitting4u" });
  const collection = mongoose.connection.db.collection(collectionName);
  const indexes = await collection.indexes();
  const currentIndex = indexes.find((index) => index.name === indexName);
  const hasDesiredIndex =
    currentIndex?.unique === true &&
    currentIndex.partialFilterExpression?.phone?.$type === "string";

  if (hasDesiredIndex) {
    console.log("User phone index is already a partial unique index; no migration needed.");
    process.exitCode = 0;
  } else {
    const duplicatePhones = await collection
      .aggregate([
        { $match: { phone: { $type: "string" } } },
        { $group: { _id: "$phone", count: { $sum: 1 } } },
        { $match: { count: { $gt: 1 } } },
        { $limit: 10 },
      ])
      .toArray();

    if (duplicatePhones.length > 0) {
      throw new Error(
        `Cannot create the unique phone index: duplicate phone values exist (${duplicatePhones.length} shown). Resolve duplicates, then rerun.`
      );
    }

    const obsoletePhoneIndexes = indexes.filter(
      (index) =>
        index.name !== "_id_" &&
        Object.keys(index.key || {}).length === 1 &&
        index.key.phone === 1
    );

    for (const index of obsoletePhoneIndexes) {
      await collection.dropIndex(index.name);
      console.log(`Dropped obsolete index: ${index.name}`);
    }

    await collection.createIndex(
      { phone: 1 },
      {
        name: indexName,
        unique: true,
        partialFilterExpression,
      }
    );
    console.log("Created partial unique phone index; email-only users can omit phone.");
  }
} finally {
  await mongoose.disconnect();
}