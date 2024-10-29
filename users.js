const users = [
    {
        id: 1,
        name: "john",
        age: 39,
    },
    {
        id: 2,
        name: "hila",
        age: 78,
    },
];
const getUser = (index) => {
    return users[index];
}
module.exports = { users, getUser };