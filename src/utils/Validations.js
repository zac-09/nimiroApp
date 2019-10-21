import moment from "moment";

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

function validatePhone(phoneString) {
    const phone = formatPhoneNumber(phoneString)
    if(phone.length > 8 && phone.length < 15) {
        return true;
    }

    return 'Invalid phone number'
}

function formatPhoneNumber(phoneString){
    const code = '+256'
    let match = phoneString.startsWith('+')

    if(match) {
        return phoneString.replace(/\s/g, '')
    }

    match = phoneString.startsWith('0')

    if(match) {
        return code + phoneString.substring(1).replace(/\s/g, '')
    }

    return code + phoneString.replace(/\s/g, '')
}

function formatDate(date = new Date()) {

    return moment(date).calendar()
}


export {
    formatPhoneNumber,
    validateEmail,
    validatePassword,
    validatePhone,
    formatDate
}