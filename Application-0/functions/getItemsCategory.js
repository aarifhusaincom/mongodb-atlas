exports = async function ({ query, headers, body }, response) {
  const databody = JSON.parse(body.text());
  const db = context.services.get("mongodb-atlas").db("aaspas");
  const category = db.collection("category");
  const items = db.collection("items");

  const { categoryID } = databody;

  if (!categoryID) {
    response.setStatusCode(400);
    return { error: "Missing required parameters" };
  }
  try {
    
    const itemsCategory = await items.find({
      categoryId: BSON.ObjectId(categoryID),
    }).toArray();
    console.log("itemscat", itemsCategory.length)
    if (itemsCategory.length > 0) {
      return {
        success: true,
        items: itemsCategory,
        msg: "Found",
      };
    } else {
      return {
        success: false,
        items: itemsCategory,
        msg: "No data Found",
      };
    }
  } catch (e) {
    response.setStatusCode(500);
    return { error: e.message };
  }
};
