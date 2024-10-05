

const login = async(req,res)=>{
    try {
        const [email, password] = req.body
const founduser = await findone({email:email})

// validating the email
if (!founduser){
    throw new error ('User not found')
}
    } catch (error) {
        
    }
}

export {login}