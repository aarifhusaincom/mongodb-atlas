exports = async function ({ query, headers, body }, response) {
  
  const db = context.services.get("mongodb-atlas").db("aaspas");
  const category = db.collection("category");

  try {
   const searchCategory = await category.find({}).toArray();
   
    return { searchCategory: searchCategory };
  } catch (e) {
    response.setStatusCode(500);
    return { error: e.message };
  }
};
