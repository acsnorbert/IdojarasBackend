const fs = require('fs');
const path = require('path');

const USERS_FILE = path.join(__dirname, '..', 'users.json');
const IDOJARAS_FILE = path.join(__dirname, '..','idojaras.json');

let users = [];
let idojaras = [];


loadIdojaras();
loadUsers();

function initStore(){
    loadUsers();
    loadIdojaras();
}


/* Userhez tartozó függvények */
function getNextID(table) {
    
    let nextID = 1;
    if (table.length == 0){
        return nextID;
    }
    let maxindex = 0
    for (let i = 1; i < table.length; i++) {
        if (table[i].id > table[maxindex].id) {
            maxindex = i;     
        }
    }
    return table[maxindex].id + 1;
}

function loadUsers(){
    if (fs.existsSync(USERS_FILE)){
        const raw = fs.readFileSync(USERS_FILE);
        try{
            users = JSON.parse(raw);
        }catch(err){
            console.log('Hiba az adatok beolvasása során!', err);
            users = [];
        }
    }else{
        saveUsers(users);
    }
}

function saveUsers(users){
    fs.writeFileSync(USERS_FILE, JSON.stringify(users));
}

function IsEmailExists(email){
    let exists = false;
    users.forEach(user => {
        if (user.email == email){
            exists = true;
            return;
        }
    });
    return exists;
}



/* Időjáráshoz tartozó függvények */

function loadIdojaras(){
    if (fs.existsSync(IDOJARAS_FILE)){
        const raw = fs.readFileSync(IDOJARAS_FILE);
        try{
            idojaras = JSON.parse(raw);
        }catch(err){
            console.log('Hiba az adatok beolvasása során!', err);
            idojaras = [];
        }
    }else{
        saveIdojaras(idojaras);
    }
}

function saveIdojaras(idojaras){
    fs.writeFileSync(IDOJARAS_FILE, JSON.stringify(idojaras));
}

module.exports = {
    users,
    idojaras,
    initStore,
    saveUsers,
    saveIdojaras,
    getNextID,
    IsEmailExists
}