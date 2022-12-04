const userModel = require("../model/user");
const jwt = require("jsonwebtoken");
// const jwtkey = "Mahakal"
const bcrypt = require("bcryptjs");
// const cookie = require("cookie-parser")



// ----------------------------------------

exports.createUser = async(req, res) => {

    try {
        // const olduser = await userModel.find({ EmailId })
        // res.json("hi")
        // if (olduser) {
        //     res.json(olduser)
        // } else {}

        const userData = await new userModel(req.body || req.query).save();
        res.json(userData);
        console.log(req.body)


    } catch (error) {
        res.json(error);
    }
}

// ------------------------------------------------------------------------------
exports.getUser = async(req, res) => {

        try {
            const user = await userModel.find({ _id: req.params.id });
            res.json(user);

        } catch (error) {
            res.json(error);

        }

    }
    // -------------------------------------------------------------------------------

exports.getAlluser = async(req, res) => {
    try {
        const Alluser = await userModel.find();
        console.log(Alluser);
        res.json(Alluser);

    } catch (error) {
        res.json(error);
        console.log(error)
    }
}

// -------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------
exports.signUp = async(req, res, next) => {
    const { Fname, Lname, EmailId, Password } = req.body;
    let exituser;
    try {
        exituser = await userModel.findOne({ EmailId: EmailId });

    } catch (error) {
        console.log(error);
    }
    if (exituser) {
        // console.log("user is already exit")
        return res.status(400).json({ massage: "user is alredy exit" })
    } else {
        const hashPassword = bcrypt.hashSync(Password);
        const user = new userModel({
            Fname: Fname,
            Lname: Lname,
            EmailId: EmailId,
            Password: hashPassword
        });
        // console.log(req.body.EmailId);
        try {
            await user.save();
            res.json(user);
            // console.log(user);
        } catch (error) {
            res.json(error);
            // console.log(error)
        }
    }
    // return res.status(200).json({ massage: "user is created" })
}

// ----------------------------------------------------------------------------------------------

exports.logIn = async(req, res, next) => {
    const { EmailId, Password } = req.body;
    let exituser;
    try {
        exituser = await userModel.findOne({ EmailId: EmailId });

    } catch (error) {
        return new Error(error);
    }
    if (!exituser) {
        return res.status(400).json({ massage: "user not found" });
    }

    const confirmpass = bcrypt.compareSync(Password, exituser.Password)
    if (!confirmpass) {
        return res.status(400).json({ massage: "Invalid Password" });
    }
    const token = jwt.sign({ id: exituser._id }, process.env.jwtkey, { expiresIn: "1hr" })
    if (req.cookies[`${exituser._id}`]) {
        req.cookies[`${exituser._id}`] = ""
    }
    console.log("Genreated Token\n", token);


    res.cookie(String(exituser._id), token, {
            path: "/",
            expires: new Date(Date.now() + 1000 * 35),
            httpOnly: true,
            sameSite: 'lax'

        })
        // console.log(req.cookie.headers)
    return res.status(200).json({ massage: "login Succusefully", user: exituser, token })

}

// ----------------------------------------------------------------------------------------------
exports.verification = (req, res, next) => {

        const bearerHeader = req.headers.cookie;

        // console.log(cookies);
        // const bearerHeader = req.headers['authorization'];
        // console.log(bearerHeader);

        if (typeof bearerHeader !== 'undefined') {
            // const bearerToken = bearerHeader.split(' ')[1];
            const bearerToken = bearerHeader.split("=")[1];
            // const tok = bearerToken.split(".")[1];
            // req.token = tok;
            req.token = bearerToken;
            console.log(req.token);
            next()
        } else {
            res.status(403).json({ massage: "token coludn't found" })
        }
    }
    // ----------------------------------------------------------------------------------------------
exports.verifyToken = (req, res, next) => {
        // console.log(req.token);
        jwt.verify(req.token, process.env.jwtkey, (err, user) => {
            if (err) {
                res.status(403).json({ massage: "token is not verify" })
                console.log(err);
            } else {
                res.json({ massage: "token verify successfully", userId: user.id })
                    // console.log(authdata);
            }
            req.id = user.id
        })
        next();
    }
    // ----------------------------------------------------------------------------------------------
exports.getUserdetails = async(req, res, next) => {
    console.log(req.id);
    let user;
    try {
        user = await userModel.findById(req.id, "-Password");
        // console.log(user);
        // res.json({ user })
    } catch (error) {
        // console.log(error)
        // res.json(error);
        return new Error(error)
    }
    if (!user) {
        console.log("user not found")
            // res.json(userd);
        res.status(404).json({ massage: "user not found" })
    }
    // console.log(user);
    res.status(200).json(user)
}



// ----------------------------------------------------------------------------------------------
exports.verificationToken = (req, res, next) => {
    const cookies = req.headers.cookie;
    console.log(cookies);
    // const headers = req.headers['authorization'];
    // console.log(headers);
    const token = cookies.split("=")[1];
    // console.log(token);
    if (!token) {
        res.status(404).json({ massage: "no token found" })
    }
    jwt.verify(String(token), process.env.jwtkey, (err, user) => {
        if (err) {
            console.log(err)
            return res.status(400).json({ massage: "Invalid Token" })
        }
        console.log(user.id);
        req.id = user.id;
    });
    next();
};
// ----------------------------------------------------------------------------------------------



exports.refreshToken = (req, res, next) => {
        const cookies = req.headers.cookie;
        const prevtoken = cookies.split("=")[1];
        if (!prevtoken) {
            return res.status(400).json({ massage: "couldn't find token" })
        }
        jwt.verify(String(prevtoken), process.env.jwtkey, (err, user) => {
            if (err) {
                console.log(err);
                return res.status(404).json({ massage: "Autentication failed" })
            }
            res.clearCookie(`${user.id}`)
            req.cookies[`${user.id}`] = ""

            const token = jwt.sign({ id: user.id }, process.env.jwtkey, {
                expiresIn: "1hr"
            })
            console.log("regenerated Token\n", token)
            res.cookie(String(user.id), token, {
                path: "/",
                expires: new Date(Date.now() + 1000 * 35),
                httpOnly: true,
                sameSite: 'lax'

            })
            req.id = user.id
            next();
        })

    }
    // -------------------------------------------------
exports.logOut = (req, res, next) => {
    const cookies = req.headers.cookie;
    console.log(cookies);
    const prevtoken = cookies.split("=")[1];
    if (!prevtoken) {
        return res.status(400).json({ massage: "couldn't find token" })
    }
    jwt.verify(String(prevtoken), process.env.jwtkey, (err, user) => {
        if (err) {
            console.log(err);
            return res.status(404).json({ massage: "Autentication failed" })
        }
        console.log(user.id)
        res.clearCookie(`${user.id}`)
        req.cookies[`${user.id}`] = ""

        console.log(user.id)
        user.id = null;
        console.log(user.id)
        console.log(req.cookies);

        return res.status(200).json({ massage: "logout Successfully" })
    })
}