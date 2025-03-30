// const mongoose = require("mongoose");
// {
//     const userSchema = new mongoose.Schema({
//         name: {
//             type: String,
//             required: true,
//         },
//         phone: {
//             type: String,
//             required: true,
//         },
//         city: {
//             type: String,
//             required: true,
//         },
//         email: {
//             type: String,
//             required: true,
//             unique:true,
//         },
//         image: {
//             type: String,
//             required: true,
//         },
//     });

//     const User = mongoose.model("User", userSchema);

//     module.exports = { User };
// }


// const mongoose = require("mongoose")

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//     },
//     phone: {
//         type: String,
//         required: true,
//     },
//     city: {
//         type: String,
//         required: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     image: {
//         type: String,
//         required: true,
//     },
// });


// module.exports = mongoose.model("User", userSchema);




const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String, required: true}, // Ensure this field is present in the request
  image: { type: String, required: true, }, 
});

const User = mongoose.model("User", userSchema);
module.exports = User;
