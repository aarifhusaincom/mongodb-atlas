
exports = async function ({ query, headers, body }, response) {
  const databody = JSON.parse(body.text());
  const db = context.services.get("mongodb-atlas").db("aaspas");
  const category = db.collection("category");
  const items = db.collection("items");
  const shops = db.collection("shop_names");
  const {
    categoryID,
    itemName,
    englishName,
  } = databody;
  const getshops = await category
    .find({
      item_name: { $regex: `^${itemName}`, $options: "i" }
    })
    .toArray();

  // Validate input parameters
  if (getshops.length > 0) {
    return { success: false, items: getshops, msg: "Already have shops" };
  }
  try {
 const categoryObjectId = new BSON.ObjectId(categoryID);
     const addShops = await items.insertOne( { item_name: itemName, item_name_english: englishName,categoryId:categoryObjectId ,click:1 } );
    console.log(addShops)
    if(addShops){
    var result = await items.find({}).toArray();
}
  
      return {
        success: true,
        items: result,
        msg: "Successfully Added",
      };
  
  } catch (e) {
    response.setStatusCode(500);
    return { error: e.message };
  }
};
