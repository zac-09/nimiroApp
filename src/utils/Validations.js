import moment from "moment";
// Validate.js validates your values as an object
import validate from 'validate.js'

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

const constraints = {
    email: {
      presence: {
        message: "Cannot be empty."
      },
      email: {
        message: 'Please enter a valid email address'
      }
    },
    password: {
      presence: {
        message: "Cannot be empty."
      },
      length: {
        minimum: 8,
        message: 'Your password must be at least 8 characters'
      }
    },
    required: {
        presence:  {
            message: "Cannot be empty."
        }
    }
}

const validator = (field, value) => {
    // Creates an object based on the field name and field value
    // e.g. let object = {email: 'email@example.com'}
    let object = {}
    object[field] = value
  
    let constraint = constraints[field]
  
    // Validate against the constraint and hold the error messages
    const result = validate(object, { [field]: constraint })
  
    // If there is an error message, return it!
    if (result) {
      // Return only the field error message if there are multiple
      return result[field][0]
    }
  
    return null
}


export {
    formatPhoneNumber,
    validateEmail,
    validatePassword,
    validatePhone,
    formatDate,
    validator
}