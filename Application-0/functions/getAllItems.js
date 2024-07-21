exports = async function ({ query, headers, body }, response) {
  
  const db = context.services.get("mongodb-atlas").db("aaspas");
  const category = db.collection("category");
   const items = db.collection("items");

  try {
   // const result = await items.find({}).toArray();
    const result = await items.aggregate([
      {
        $lookup: {
          from: "category",        // the name of the collection to join
          localField: "categoryId",// the field from the items collection
          foreignField: "_id",     // the field from the category collection
          as: "categoryDetails"    // the name of the array to add the category documents
        }
      }]).toArray();
    return { data: result };
  } catch (e) {
    response.setStatusCode(500);
    return { error: e.message };
  }
};
