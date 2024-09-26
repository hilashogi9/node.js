const user = require('../models/user');
const User=require('../models/user')

const users = [
    {id: 1, name: 'hila'},
    {id: 2,name:'shogi'},
    {id: 3, name: 'michael'},
    {id: 4, name: 'katani'}
];

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const addUser=(req,res)=> {
    const {name, email, password}= req.body;

    const newUser=new User({name, email, password})
    newUser.save()
    return res.status(201).json(newUser)
}

const deleteUser=(req,res)=>{
    const {id, name } = req.body;
    const user1 = {
        id,
        name,
    };
    console.log(user1)
    index = users.findIndex(user=>user.id===user1.id);
    console.log(index)
    users.splice(index,1);
    return res.status(201).json(users);
}

const updateUser=(req, res) => {
    const { id } = req.query;
    const { name } = req.body;

    const index = users.findIndex(user => user.id == id);
    if (index === -1 || users.find(user => user.name === name)) {
        return res.status(400).json({ error: index === -1 ? 'user not found' : 'name already exists' });
    }

    users[index].name = name;
    return res.status(200).json(users);
}

module.exports={
     getUsers,
     addUser,
     deleteUser,
     updateUser

}