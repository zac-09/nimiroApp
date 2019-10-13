function validatePassword(pw) {

    if(pw.length >= 8){
        return true;
    }

    return 'Password too short'

}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(email).toLowerCase())){
        return true;
    }

    return 'Invalid email address'
}


export {
    validateEmail,
    validatePassword
}