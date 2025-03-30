const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const User = require('../models/users')
const fs = require('fs');
const routes = express.Router();
const path = require('path');


// const storage = multer.diskStorage({
//     destination: "./Uploads/",
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + "-" + file.originalname);
//     },
//   });
//   const upload = multer({ storage: storage }).single("image");
// Create the Uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'Uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './Uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage }).single('image');

// Add user route
routes.post('/add', upload, async (req, res) => {
  try {
    const { name, email, city, phone } = req.body;
    const image = req.file ? req.file.filename : '';

    if (!image) {
      return res.status(400).send('Image is required');
    }

    const newUser = new User({
      name,
      email,
      city,
      phone,
      image,
    });

    await newUser.save();
    req.session.message = { message: 'User added successfully', type: 'success' };
    res.redirect('/');
  } catch (error) {
    console.error(error);
    req.session.message = { message: 'Error adding user', type: 'danger' };
    res.redirect('/');
  }
});


// routes.post("/add", upload, async (req, res) => {
//     console.log("ok")
//     try {
       
//       const newUser = new User({ 
//         name: req.body.name,
//         email: req.body.email,
//         phone: req.body.phone,
//         city: req.body.city,
//         img: req.file ? req.file.filename : ""
//       });
//       await newUser.save();
//         req.session.message = { message: "User has been successfully entered", type: "success" };
//     } 
//     catch (err) {
       
//         req.session.message = { message: "Error occurred", type: "danger" };
//         console.log(err);
//         }
        
    
// });

routes.post("/add", upload, async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      city: req.body.city,
      img: req.file ? req.file.filename : "",
    });

    await user.save();
    req.session.message = {
      message: "User has been successfully added",
      type: "success",
    };
    // res.redirect("/");
  } catch (err) {
    console.error(err);
    req.session.message = { message: "Error occurred", type: "danger" };
    res.redirect("/");
  }
});
// Route for rendering the add_users page
routes.get("/add", (req, res) => {
    res.render("add_user", {
      title: "User Page",
    });
  });



routes.get("/", async (req, res) => {
    console.log("index")
    try {
      const users = await User.find().exec(); // Fetch users from the database
      // const message = req.session.message; // Retrieve the message from the session
      // delete req.session.message; // Remove the message from the session
  
      res.render("index", {
        title: "Home Page", 
        users: users, // Pass the users data to the view
        message: "", // Pass the message to the view
      });
    } catch (err) {
      console.log(err);
      req.session.message = {
        type: "danger",
        message: "Failed to fetch users",
      };
      res.redirect("/");
    }
  });


// How to edit Record

// routes.get("/edit/:id", async (req, res) => {
//     try {
//         const id = req.params.id;
//         const user = await User.findById(id).exec();

//         if (!user)
//              return res.redirect("/");

//         res.render("edit_user", {
//             title: "Edit User",
//             user: user
//         });

//     } catch (err) {
//         console.log(err);
//         res.redirect("/");
//     }
// });
routes.get('/edit/:id', async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId); // Fetch user from DB

      if (!user) {
          return res.status(404).send('User not found');
      }

      // Pass user object to the view
      res.render('edit_user', { User: user });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
});

// Update record using Image
// routes.post("/update/:id", upload, async (req, res) => {
//     try {
//         const id = req.params.id;
//         const image = req.file ? req.file.filename : req.body.old_name; // Keep old image if no new image is uploaded

//         const updatedUser = await User.findByIdAndUpdate(id, {
//             name: req.body.name,
//             email: req.body.email,
//             city: req.body.city,
//             phone: req.body.phone,
//             img: image 
//         }, { new: true });

//         if (!updatedUser) {
//             throw new Error("Try Again");
//         }

//         // If a new image was uploaded, delete the old image
//         if (req.file && req.body.old_name) {
//             fs.unlinkSync(`./Uploads/${req.file.old_name}`);
//         }

//         req.session.message = 
//         { message: "User updated successfully",
//          type: "success" };
//         res.redirect("/");

//     } catch (err) {
//         console.log(err);
//         req.session.message =
//          { message: "Error updating user",
//          type: "danger" };
//         res.redirect("/");
//     }
// });


routes.post("/update/:id", upload, async (req, res) => {
  try {
      const id = req.params.id;

      // Get the image filename: either the new image or the old one if no new image was uploaded
      const image = req.file ? req.file.filename : req.body.old_name;

      // Update the user with the new data
      const updatedUser = await User.findByIdAndUpdate(id, {
          name: req.body.name,
          email: req.body.email,
          city: req.body.city,
          phone: req.body.phone,
          img: image
      }, { new: true });

      if (!updatedUser) {
          throw new Error("Try Again");
      }

      // If a new image was uploaded, delete the old image
      if (req.file && req.body.old_name) {
            const oldImagePath = path.join(__dirname, '..', 'Uploads', req.body.old_name);
            
            // Check if the old file exists before trying to delete it
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            } else {
                console.log(`File not found: ${oldImagePath}`);
            }
        }

      req.session.message = { message: "User updated successfully", type: "success" };
      res.redirect("/");

  } catch (err) {
      console.log(err);
      req.session.message = { message: "Error updating user", type: "danger" };
      res.redirect("/");
  }
});
// code delete using image


routes.get("/delete/:id", async (req, res) => {
    try {
        const user_id = req.params.id;
        
        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(user_id);

        if (!deletedUser) {
            req.session.message = { message: "User not found", type: "danger" };
            return res.redirect("/");
        }

        // If the user has an image, delete the file
        if (deletedUser.img) {
            fs.unlinkSync(`./Uploads/${deletedUser.img}`);
            console.log("Image deleted:", deletedUser.img);
        }

        req.session.message = { message: "User deleted successfully", type: "success" };
        res.redirect("/");

    } catch (err) {
        console.log("Error deleting user:", err);
        req.session.message = { message: "Error deleting user", type: "danger" };
        res.redirect("/");
    }
});

module.exports = routes;




