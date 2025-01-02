const userid = async(req,res, next) => {
    try {
        if (req.params.userID  > 100) {
            res.status(400).send({message: "User id out of bound"});
        } else {
            next();
        }
    } catch(error) {
        console.log(error);
        res.status(500).send({message: "something went wrong"});
    }
}

module.exports = userid;