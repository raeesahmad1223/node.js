require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");

/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  try {
    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );
    const food = { latest, thai, american, chinese };

    res.render("index", { title: "Cooking Blog - Home", categories, food });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories
 *  Categories
 */
exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", {
      title: "Cooking Blog - Categories",
      categories,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /categories/:id
 *  Categories
 */
exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 5;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    console.log(categoryById);
    res.render("categories", {
      title: "Cooking Blog - Categories",
      categoryById,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /recipe/:id
 *  Recipe
 */
exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);

    res.render("recipe", { title: "Cooking Blog - Recipe", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * POST /search
 *  Serach Recipe
 */
exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;

    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Cooking Blog - Serach", recipe });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-latest
 *  Explore Latest
 */
exports.exploreLatest = async (req, res) => {
  try {
    let limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Cooking Blog - Explore Latest",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /explore-random
 *  Explore Random as JSON
 */
exports.exploreRandom = async (req, res) => {
  try {
    let count = await Recipe.find({}).countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
    res.render("explore-random", {
      title: "Cooking Blog - Explore Random",
      recipe,
    });
  } catch (error) {
    res.status(500).send({ message: error.message || "Error Occured" });
  }
};

/**
 * GET /submit-recipe
 *  Submitting Recipe
 */
exports.submitRecipe = async (req, res) => {
  let infoErrorsObj = req.flash("infoErrors");
  let infoSubmitObj = req.flash("infoSubmit");

  res.render("submit-recipe", {
    title: "Cooking Blog - Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

/**
 * POST /submit-recipe
 *  Submitting Recipe
 */
exports.submitRecipePost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.lof("No files were uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;
      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.status(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      email: req.body.email,
      description: req.body.description,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};

// // Deleting the Recipe
// async function deleteRecipe() {
//   try {
//     const res = await Recipe.deleteOne({ name: "thai-green-curry" });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();

// // Updating the Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({name:"Zain Zafar"},{name:"Cofee Coffee"})
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error)
//   }
// }
// updateRecipe()

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany(data)
//   } catch (error) {
//     console.log(`Error Found ${error}`)
//   }
// }

// const data = [
//   {
//     "name":"Thai",
//     "image":"thai-food.jpg"
//   },
//   {
//     "name":"American",
//     "image":"american-food.jpg"
//   },
//   {
//     "name":"Chinese",
//     "image":"chinese-food.jpg"
//   },
//   {
//     "name":"Mexican",
//     "image":"mexican-food.jpg"
//   },
//   {
//     "name":"Indian",
//     "image":"indian-food.jpg"
//   },
//   {
//     "name":"Spanish",
//     "image":"spanish-food.jpg"
//   },
// ]

// insertDymmyCategoryData()

// async function insertDymmyRecipeData(){
//     try {
//       await Recipe.insertMany([
//         {
//           "name": "grilled-lobster-rolls",
//           "description": `Recipe Description Goes Here`,
//           "email": "recipeemail@raddy.co.uk",
//           "ingredients": [
//             "1 level teaspoon baking powder",
//             "1 level teaspoon cayenne pepper",
//             "1 level teaspoon hot smoked paprika",
//           ],
//           "category": "American",
//           "image": "grilled-lobster-rolls.jpg"
//         },

//       ]);
//     } catch (error) {
//       console.log('err', + error)
//     }
//   }

//   insertDymmyRecipeData()
