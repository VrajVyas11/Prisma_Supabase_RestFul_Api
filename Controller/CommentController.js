import prisma from "../DB/db.config.js";

export const fetchComments = async (req, res) => {
    try {
        const comments = await prisma.comment.findMany({
            include:{
                user:true,
                post:{
                    include:{
                        user:true
                    }
                }
            }
        })

        return res.json({ status: 200, data: comments })
    } catch (error) {
        return res.json({ message: `error ${error}` })
    }

}

export const createComment = async (req, res) => {
    try {
        const { post_id, user_id, comment } = req.body

        const newComment = await prisma.comment.create({
            data: {
                user_id: Number(user_id),
                post_id: Number(post_id),
                comment,
            }
        })

        //increase count
        await prisma.post.update({
            where:{
                id:Number(post_id)
            },
            data:{
                comment_count:{
                    increment:1
                }
            }
        })

        return res.json({ status: 200, data: newComment, message: "Comment Created" })
    } catch (error) {
        return res.json({ message: `error ${error}` })
    }
}


export const updateComment = async (req, res) => {
    try {
        const commentId = req.params.id
        const { post_id, user_id, comment } = req.body

        await prisma.comment.update({
            where: {
                id: Number(commentId)
            },
            data: {
                user_id: Number(user_id),
                post_id: Number(post_id),
                comment,
            }
        })
        return res.json({ status: 200, message: "Comment Details Updated" })
    } catch (error) {
        return res.json({ status: 400, message: "Comment doesn't Exist", error })
    }
}




export const showComment = async (req, res) => {
    try {
        const commentId = req.params.id

        const comment = await prisma.comment.findFirst({
            where: {
                id: Number(commentId)
            },
            include:{
                user:true,
                post:{
                    include:{
                        user:true
                    }
                }
            }
        })
        return res.json({ status: 200, data: comment, message: "found the Comment" })
    } catch (error) {
        return res.json({ status: 400, message: "Comment doesn't Exist", error })
    }

}


export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id
     const {post_id}=req.body
        await prisma.comment.delete({
            where: {
                id: Number(commentId)
            }
        })
         //decrease count
         await prisma.post.update({
            where:{
                id:Number(post_id)
            },
            data:{
                comment_count:{
                    decrement:1
                }
            }
        })
        return res.json({ status: 200, message: "Comment Deleted Successsfully" })
    } catch (error) {
        return res.json({ status: 400, message: "Comment doesn't Exist", error })
    }

}
