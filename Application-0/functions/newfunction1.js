exports = async function ({ query, headers, body }, response) {
  const databody = JSON.parse(body.text());
  const db = context.services.get("mongodb-atlas").db("aaspas");
  const category = db.collection("category");

  const shopname = db.collection("shop_names");
  const { searchKeyWord, location } = databody;
  // Validate input parameters
  if (!searchKeyWord || !location) {
    response.setStatusCode(400);
    return { error: "Missing required parameters" };
  }

  try {
    if (typeof searchKeyWord !== "string") {
      searchKeyWord = String(searchKeyWord); 
    }

    const regex = new RegExp(`^${searchKeyWord}`, "i");

    const searchCategory = await category
      .find({
        category_name: { $regex: `^${searchKeyWord}` },
      })
      .toArray();
    const searchShops = await shopname.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates: location },
          distanceField: "distance",
          spherical: true,
          maxDistance: 5000, // Limit to 5 km
        },
      },
      {
        $match: {
          shopName: { $regex: `^${searchKeyWord}` },
        },
      },
      {
        $addFields: {
          distanceKm: { $divide: ["$distance", 1000] }, 
        },
      },
    ]);

    return { searchCategory: searchCategory, searchShops: searchShops };
  } catch (e) {
    response.setStatusCode(500);
    return { error: e.message };
  }
};
