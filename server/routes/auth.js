const express = require('express');
const router = express.Router();
const User = require('../model/userSchema');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const authenticate = require('../middleware/authenticate');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/userProfiles')
    },
    filename: function (req, file, cb) {
        const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1000);
        cb(null, uniquePrefix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage });


router.get('/login', (req, res) => {
    res.send("Login page");
});
router.post('/register', upload.single('profile'), async (req, res) => {
    const { name, age, dob, gender, phone, email, password, marital_status, mother_tongue, religion, city, pincode } = req.body;
    let profile = (req.file) ? req.file.filename : null;
    var date = new Date(dob);

    const modified_dob = date.toISOString().split('T')[0];

    if (!name || !email || !phone || !password || !gender || !age || !dob || !marital_status || !mother_tongue || !religion || !city || !pincode) {
        console.log("hi");
        return res.status(422).json({ error: "Please fill all fields properly." })
    }
    try {
        const userExist = await User.findOne({ email: email });
        if (userExist) {
            return res.status(422).json({ error: "User with entered email already exists." })
        }
        else {
            const user = new User({ name, age, dob: modified_dob, gender, phone, email, password, profile, marital_status, mother_tongue, religion, city, pincode });
            const userRegistration = await user.save();
            if (userRegistration) {
                res.status(201).send({ message: "User registered successfully." })
            }
            else {
                res.status(500).send({ error: "Registration failed due to some internal error.Please try again" })
            }
        }
    }
    catch (err) {
        console.log(err);
    }

});
router.post('/about', authenticate, (req, res) => {
    res.send(req.rootUser);
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(422).json({ error: "Please fill all fields properly." })
    }
    try {
        const userLogin = await User.findOne({ email });
        if (userLogin) {
            const isMatching = await bcrypt.compare(password, userLogin.password);
            console.log("ismatching",isMatching);
            if (isMatching) {
                const token = await userLogin.generateAuthToken(userLogin);
                res.cookie("jwtoken", token);
                return res.status(202).json({ message: "Login successful." })
            }
            else {
                res.status(422).json({ error: "Invalid credentials! Please try again.." })
            }
        }
        else {
            res.status(422).json({ error: "Invalid credentials! Please try again.." })
        }

    }
    catch (err) {
        console.log(err);
    }
});
router.post('/view', authenticate, async (req, res) => {
    console.log('here in view route');
    const { id } = req.body;
    console.log(id);
    if (!id) {
        return res.status(422).json({ error: "Not found" });
    }
    try {
        const userFound = await User.findOne({ _id: id });
        if (userFound) {
            res.status(201).send(userFound);
        }
        else {
            res.status(422).json({ error: "Invalid credentials" })
        }
    }
    catch (err) {
        console.log(err);
    }
})

router.post('/filter', async (req, res) => {
    const gtage = parseInt(req.body.gtage);
    const ltage = parseInt(req.body.ltage);
    const gender = req.body.gender;
    const religion = req.body.religion;
    const marital_status = req.body.marital_status;
     console.log("marital",marital_status);
    if (ltage && gtage && ltage < gtage) {
        return res.status(422).json({ error: "Invalid age range" });
    }

    let fltparam = {};

    if (gtage && ltage) {
        fltparam.age = { $gte: gtage, $lte: ltage };
    } else if (gtage) {
        fltparam.age = { $gte: gtage };
    } else if (ltage) {
        fltparam.age = { $lte: ltage };
    }

    if (gender) {
        fltparam.gender = gender;
    }

    if (religion) {
        fltparam.religion = religion;
    }
    if (marital_status) {
        fltparam.marital_status = marital_status;
    }
    try {
        const users = await User.find(fltparam);
       //  console.log("users");
        if (users.length > 0) {
       
            return res.status(200).json(users);
        } else {
     
            return res.status(404).json({ error: "No matches found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwtoken', { path: '/home' });
    console.log("logged out");
    res.status(200).json({ message: "Logged out successfully." });
});
router.post('/edit', authenticate, (req, res) => {
    res.send(req.rootUser);
});
router.post('/delete', authenticate, async (req, res) => {
    if (req.rootUser._id) {
        console.log("here in delete route")
        try {
            const userExist = await User.findOne({ _id: req.rootUser._id });
            if (userExist) {
                userExist.remove();
                return res.status(202).json({ message: "success" });
            }
            else {
                return res.status(422).json({ error: "User not found." })
            }
        }
        catch (err) {
            res.status(422).json({ error: "Invalid credentials" })
            console.log(err);
        }
    }
    else {
        res.status(422).json({ error: "Invalid credentials" })
        console.log(err);
    }
});

module.exports = router;