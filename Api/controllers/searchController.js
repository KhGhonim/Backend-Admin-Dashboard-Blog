import PostModel from "../Models/Post.js";
import UserModel from "../Models/User.js";

export const Search = async (req, res, next) => {
  const id = req.query.q;
  const catagory = req.query.type;
  console.log(id, catagory);

  try {
    if (id) {
      if (catagory === "users") {
        const resultOfUserSearch = await UserModel.find({
          name: { $regex: id, $options: "i" },
        });
        return res.status(200).send(resultOfUserSearch);
      } else if (catagory === "posts") {
        const resultOfPostSearch = await PostModel.find({
          title: { $regex: id, $options: "i" },
        });
        return res.status(200).send(resultOfPostSearch);
      }
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
};
