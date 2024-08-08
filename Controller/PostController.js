import prisma from "../DB/db.config.js";

export const fetchPosts = async (req, res) => {
    try {
        // let page = Number(req.query.page) || 1
        // let limit = Number(req.query.limit) || 10
        // if (page <= 0) {
        //     page = 1
        // }
        // if (limit <= 0 || limit>=100) {
        //     limit=10
        // }
        // const skip=(page-1)*limit
        const posts = await prisma.post.findMany({
            // skip:skip,
            // take:limit,
            include: {
                comment: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                id: "desc"
            }
        })
        // const totalposts = await prisma.post.count()
        // const totalPages = Math.ceil(totalposts / limit)
        return res.json({
            status: 200, data: posts,
            //             meta:{
            // totalPages,
            // currentPages:page,
            // limit
            //             }
        })
    } catch (error) {
        return res.json({ message: `error ${error}` })
    }

}

export const createPost = async (req, res) => {
    try {
        const { user_id, title, description } = req.body

        const newPost = await prisma.post.create({
            data: {
                user_id: Number(user_id),
                title,
                description,
            }
        })

        return res.json({ status: 200, data: newPost, message: "Post Created" })
    } catch (error) {
        return res.json({ message: `error ${error}` })
    }
}


export const updatePost = async (req, res) => {
    try {
        const postId = req.params.id
        const { user_id, title, description } = req.body

        await prisma.post.update({
            where: {
                id: Number(postId)
            },
            data: {
                user_id: Number(user_id),
                title,
                description,
            }
        })
        return res.json({ status: 200, message: "Post Details Updated" })
    } catch (error) {
        return res.json({ status: 400, message: "Post doesn't Exist", error })
    }
}




export const showPost = async (req, res) => {
    try {
        const postId = req.params.id

        const post = await prisma.post.findFirst({
            where: {
                id: Number(postId)
            },
            include: {
                comment: {
                    include: {
                        user: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        })
        return res.json({ status: 200, data: post, message: "found the Post" })
    } catch (error) {
        return res.json({ status: 400, message: "Post doesn't Exist", error })
    }

}


export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id
        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })
        return res.json({ status: 200, message: "Post Deleted Successsfully" })
    } catch (error) {
        return res.json({ status: 400, message: "Post doesn't Exist", error })
    }

}


export const searchPost = async (req, res) => {
    const query = req.query.q
    const posts = await prisma.post.findMany({
        where: {
            description: {
                search: query
            }
        }
    })
    return res.json({ status: 200, data: posts })
}
