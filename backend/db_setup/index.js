const { User } = require('../models').models

const createAdmin = async () => {
    try {
        const admin = await User.findOne({role:"admin"}) // check if admin is already in DB
        if(admin) {
            console.log('Admin found');
            return true
        } 

        const newAdmin = await User.create({
            password: "admin",
            first_name: "admin",
            middle_name: "",
            last_name: "admin",
            email: "admin",
            isApproved: true,
            role: 'admin'
        })

        const status = await newAdmin.save()
        console.log('Admin created');
    }
    catch(err) {
        return(err)
    }
}

module.exports = createAdmin