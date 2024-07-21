exports = async function ({ query, headers, body }, response) {
  const databody = JSON.parse(body.text());
  const db = context.services.get("mongodb-atlas").db("aaspas");
  const category = db.collection("category");
  const items = db.collection("items");
  const shops = db.collection("shop_names");

  const {
    shopName,
    address,
    area,
    coordinates,
    ownerName,
    phoneNo,
    categoryID,
    days,
    openTime,
closeTime
  } = databody;
  const lats = coordinates.coordinates;
  
  const getshops = await shops
    .find({
      shopName: { $regex: `^${shopName}`, $options: "i" },
        "location.coordinates": lats
    })
    .toArray();

  // Validate input parameters
  if (getshops.length > 0) {
    
    return { success: false, items: getshops, msg: "Already have shops" };
  }
  try {
 // Convert each categoryID to ObjectId
    const objectIdCategoryIDs = categoryID.map(id => new BSON.ObjectId(id));
     // const categoryObjectId = new BSON.ObjectId(categoryID);
    console.log(objectIdCategoryIDs)
     // const addShops = await items.insertOne( { item_name: itemName, item_name_english: englishName,catagoryId:categoryObjectId ,click:1 } );

     const addShops = await shops.insertOne( { shopName: shopName, address: address,area:area ,location:coordinates,ownerName:ownerName,phoneNo:phoneNo,categoryId:objectIdCategoryIDs, workingDays:days, 
openTime:openTime , closeTime:closeTime } );
     const result = await shops.aggregate([
      {
        $lookup: {
          from: "category",        // the name of the collection to join
          localField: "categoryId",// the field from the items collection
          foreignField: "_id",     // the field from the category collection
          as: "categoryDetails"    // the name of the array to add the category documents
        }
      }]).toArray();
  
      return {
        success: true,
        items: result,
        msg: "Successfully Added",
      };
  
  } catch (e) {
    console.log(e)
    response.setStatusCode(500);
    return { error: e.message };
  }
};
