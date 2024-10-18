import User from "../models/userModel.js"
import bycrypt from 'bcrypt'


const login = async(req,res)=>{
    try {
        const [email, password] = req.body
const foundUser = await User.findone({email:email})

// validating the email
if (!foundUser){
    throw new error ('User not found')
}

const isValid = await bycrypt.compare(password, foundUser.password)

if(!isValid){
    return res.status(404).json({success:false, message: "Invalid credentials"})
}
    } catch (error) {
        res.status(500).json({message: 'Internal server error'})
    }
}

export {login}