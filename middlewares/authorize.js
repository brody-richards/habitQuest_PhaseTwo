const authorize = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
        next(); 
    } else {
        res.status(403).json({ message: "Access denied" });
    }
    };
}; // if the role matches then grant access, if not, deny access.

module.exports = authorize;