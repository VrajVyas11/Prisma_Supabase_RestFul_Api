import prisma from "../DB/db.config.js";

export const fetchUsers = async (req, res) => {
   try {
     const users = await prisma.user.findMany({
        include:{
            post:{
                select:{
                    title:true,
                    comment_count:true
                }
            }
        },
        // select:{
        //     _count:{
        //         select:{
        //             post:true,
        //             comment:true
        //         }
        //     }
        // }
     })
 
     return res.json({ status: 200, data: users })
   } catch (error) {
    return res.json({message:`error ${error}`})
   }

}

export const createUser = async (req, res) => {
    try {
        const { name, email, password } = req.body
    
        const findUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })
    
        if (findUser) {
            return res.json({ status: 400, message: "Email Already Taken..Enter another email" })
        }
    
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password
            }
        })
    
        return res.json({ status: 200, data: newUser, message: "User Created" })
    } catch (error) {
        return res.json({message:`error ${error}`})
    }
}


export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const { name, email, password } = req.body

        const user = await prisma.user.update({
            where: {
                id: Number(userId)
            },
            data: {
                name,
                email,
                password,
            }
        })
        return res.json({ status: 200, message: "User Details Updated" })
    } catch (error) {
        return res.json({ status: 400, message: "User doesn't Exist",error })
    }
}




export const showUser = async (req, res) => {
    try {
        const userId = req.params.id

        const user = await prisma.user.findFirst({
            where: {
                id: Number(userId)
            },
            include:{
                post:{
                    select:{
                        title:true,
                        comment_count:true
                    }
                }
            },
        })
        return res.json({ status: 200, data: user, message: "found the User" })
    } catch (error) {
        return res.json({ status: 400, message: "User doesn't Exist",error })
    }

}


export const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        const user = await prisma.user.delete({
            where: {
                id: Number(userId)
            }
        })
        return res.json({ status: 200, message: "User Deleted Successsfully" })
    } catch (error) {
        return res.json({ status: 400, message: "User doesn't Exist",error })
    }

}
