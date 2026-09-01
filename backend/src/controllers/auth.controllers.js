const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const userModel=require('../model/user.model')
const blacklist=require('../model/tokenblacklist.model')

async function userRegister(req, res) {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
        return res.status(400).json({
            message: 'All details are required'
        })
    }

    const existingUser = await userModel.findOne({
        $or: [{ email }, { username }]
    })

    if (existingUser) {
        return res.status(400).json({
            message: 'User already exists'
        })
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        username,
        email,
        password: hash
    })

    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT || 'secretkey', { expiresIn: '1d' })

    res.cookie('token', token)

    return res.status(201).json({
        message: 'User registered successfully',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function loginController(req, res) {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(400).json({
            message: 'Email does not exist'
        })
    }

    const isPass = await bcrypt.compare(password, user.password)
    if (!isPass) {
        return res.status(400).json({
            message: 'Wrong password'
        })
    }

    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, process.env.JWT || 'secretkey', { expiresIn: '1d' })

    res.cookie('token', token)

    return res.status(200).json({
        message: 'Login successful',
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

async function logOutController(req, res) {
    const token = req.cookies.token

    if (token) {
        await blacklist.create({ token })
    }

    res.clearCookie('token')

    return res.status(200).json({
        message: 'Token blacklisted successfully'
    })
}

async function getmeController(req,res){
    const user=await userModel.findById(user.id);

    return res.status(400).json({
        message:"User details fetched Succesfully",
        user:{
            id:user._id,
            username:user.username,
            email:user.email
                }

    })
}


module.exports={ userRegister, loginController, logOutController,getmeController }