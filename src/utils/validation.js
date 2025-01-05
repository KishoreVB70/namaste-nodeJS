function userValidation(user) {
    if (!user.name || !user.password || !user.image || !user.email) {
        return false;
    }

    if (!usernameValidation(user.name)) return false;
    if (!passwordValidation) return false;
    if (!emailValidation) return false;
    return true;
}

function usernameValidation(name) {
    if (name.length < 3 || name.length > 14) return false;
}

function passwordValidation() {
    return true;
}

function emailValidation() {
    return true;
}

module.exports = {userValidation};