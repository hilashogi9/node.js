const {getUsers, addUser, deleteUser, updateUser}= require('../controllers/user')

const router= require('express').Router();

router.get('/users', getUsers);

router.post('/add-user', addUser);

router.delete('/delete-user', deleteUser);

router.patch('/update-user', updateUser);

module.exports=router;