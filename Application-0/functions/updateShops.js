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
    closeTime,
    id,
  } = databody;
  const lats = coordinates.coordinates;


  try {
    const objectIdCategoryIDs = categoryID.map((id) => new BSON.ObjectId(id));

    console.log(objectIdCategoryIDs);

    const updateShops = await shops.updateOne(
      { _id: BSON.ObjectId(id) }, 
      {
        $set: {
          shopName: shopName,
          address: address,
          area: area,
          location: coordinates,
          ownerName: ownerName,
          phoneNo: phoneNo,
          categoryId: objectIdCategoryIDs,
          workingDays: days,
          openTime: openTime,
          closeTime: closeTime,
        },
      }
    );
console.log(updateShops)
    const result = await shops
      .aggregate([
        {
          $lookup: {
            from: "category", // the name of the collection to join
            localField: "categoryId", // the field from the items collection
            foreignField: "_id", // the field from the category collection
            as: "categoryDetails", // the name of the array to add the category documents
          },
        },
      ])
      .toArray();

    return {
      success: true,
      items: result,
      msg: "Successfully updated",
    };
  } catch (e) {
    console.log(e);
    response.setStatusCode(500);
    return { error: e.message };
  }
};
