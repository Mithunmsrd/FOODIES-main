const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const collection = require('./model/user_mongoose');

const publicPath = path.join(__dirname, "public");

app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: false }));

mongoose.connect("mongodb://localhost:27017/foodies", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true // Add this line to enable useCreateIndex
})
.then(() => {
    console.log("Database connected");
})
.catch((err) => {
    console.error("Failed to connect to database", err);
});

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(publicPath, "user_login.html"));
});

app.get("/user_register", (req, res) => {
    res.sendFile(path.join(publicPath, "user_register.html"));
});

app.post("/user_login", async (req, res) => {
    try {
        const { email, password } = req.body;
       
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.send("User already exists");
        }
        
        const newUser = new collection({ email, password });
        await newUser.save();
        res.redirect("/user_login"); 
    } catch (error) {
        console.error("Error registering user:", error);
        res.send("Registration failed. Please try again.");
    }
});


const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
