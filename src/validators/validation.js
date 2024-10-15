let isValid=function (val){
    if(typeof val==='undefined'||val===null) return false
    if(typeof val==='string' && val.trim().length===0) return false
    return true
}

function isUrlValid(userInput) {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if(res == null)
        return false;
    else
        return true;
}

// Import Moment.js
const moment = require('moment');

// Function to validate a date
function validateDate(dateString) {
    const date = moment(dateString, 'YYYY-MM-DD', true); // Specify the format and strict parsing
    return date.isValid();

    // Example usage
// const date1 = '2024-10-15'; // Valid date YYYY-MM-DD
// const date2 = '2024-02-30'; // Invalid date
}

function isValidNum(duration){
    if (typeof duration === 'number' && !isNaN(duration) && duration !== '') {
        return true
    }else{
        return false
    }
}

const isvalidEmail = /^\s*[a-zA-Z0-9]+([\.\-\_\+][a-zA-Z0-9]+)*@[a-zA-Z]+([\.\-\_][a-zA-Z]+)*(\.[a-zA-Z]{2,3})+\s*$/


module.exports={isValid,isUrlValid,validateDate,isValidNum,isvalidEmail}