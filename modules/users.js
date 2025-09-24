const express = require('express')
const router = express.Router()

const { users, IsEmailExists, getNextID, saveUsers } = require('../utils/store');

// GET Összes user 
    router.get('/', (_req, res) => {
    res.send(users);
});

// GET user id alapján  

router.get('/:id', (req,res) => {
    let id = req.params.id;
    let idx = users.findIndex(user => user.id == id);
    if (idx > -1) {
        return res.send(users[idx]);
    }
    return res.status(400).send({msg: 'Nincs ilyen azonosítójú felhasználó!'});
})

// POST új user
router.post('/', (req, res) => {
    let data = req.body;
    if (IsEmailExists(data.email)){
        return res.status(400).send({msg: 'Ez az e-mail cím már regisztrált!'});
    }
    data.id = getNextID(users);
    users.push(data);
    saveUsers(users);
    res.send({msg: 'A felhasználó regisztrálva!'});
});

// POST user belépés check
router.post('/login', (req, res) => {
    let { email, password } = req.body;
    let loggeduser = {};
    users.forEach(user => {
        if (user.email == email && user.password == password){
            loggeduser = user;
            return
        }
    })
    res.send(loggeduser);
});

// Update user profil
router.patch('/profile', (req, res)=>{ 
    let {id, name, email } = req.body;

    id = Number(id);

    let idx = users.findIndex(user =>  user.email == email && user.id != id );

    if (idx > -1){
        return res.status(400).send({ msg: 'Ez az e-mail cím már foglalt!'});
    }

    idx = users.findIndex(user =>  user.id == id );
    if (idx == -1){
        return res.status(400).send({ msg: 'Nem található a felhasználó!'});
    }

    users[idx].name = name;
    users[idx].email = email;
    saveUsers();

    return res.send({ msg: 'A profil módosítva!'});

});

// update user jelszó
router.patch('/passmod', (req, res)=>{ 
    let {id, oldPass, newPass } = req.body;

    id = Number(id);

    idx = users.findIndex(user =>  user.id == id );
    if (idx == -1){
        return res.status(400).send({ msg: 'Nem található a felhasználó!'});
    }

    if (users[idx].password != oldPass){
        return res.status(400).send({msg: 'A megadott jelenlegi jelszó nem megfelelő!'});
    }

    users[idx].password = newPass;
    saveUsers();

    return res.send({ msg: 'A jelszó sikeresen módosítva!'});

});

// UPDATE user id alapján
router.patch('/:id', (req, res) => {
    let id = req.params.id;
    let data = req.body;
    let idx = users.findIndex(user => user.id == id);
    if (idx > -1) {
        users[idx] = data;
        users[idx].id = Number(id);
        saveUsers();
        return res.send({msg: 'A felhasználó módosítva'});
    }
    return res.status(400).send({msg:'Nincs ilyen azonosítójú felhasználó!'});
});

// DELETE user by id
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let idx = users.findIndex(user => user.id == id);
    if (idx > -1) {
        users.splice(idx, 1);
        saveUsers();
        return res.send({msg: 'A felhasználó törölve'});
    }
    return res.status(400).send({msg: 'Nincs ilyen azonosítójú felhasználó!'});
});


module.exports = router;