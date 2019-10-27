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

function formatPhoneNumber(phoneString = ''){
    const code = '+256'
    let match = phoneString.startsWith('+')

    if(match) {
        return phoneString.replace(/\s/g, '').replace(/-/g, '')
    }

    match = phoneString.startsWith('0')

    if(match) {
        return code + phoneString.substring(1).replace(/\s/g, '').replace(/-/g, '')
    }

    return code + phoneString.replace(/\s/g, '').replace(/-/g, '')
}

function formatDate(date = new Date()) {

    const REFERENCE = moment(new Date()); // fixed just for testing, use moment();
    const TODAY = REFERENCE.clone().startOf('day');
    const YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day');
    const A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day');

    if(moment(date).isSame(TODAY, 'd')){
       return moment(date).format('LT');
    }

    if(moment(date).isSame(YESTERDAY, 'd')){
        return 'Yesterday'
    }

    return moment(date).format('l');
}


export {
    formatPhoneNumber,
    validateEmail,
    validatePassword,
    validatePhone,
    formatDate
}