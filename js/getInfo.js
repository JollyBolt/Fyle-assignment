export const getInfo = async() =>{
    const userName = document.getElementById('username').value
    try {
        const {data} = await axios.get(`https://api.github.com/users/${userName}`)
        return data
    } catch (error) {
        console.log(error)
    }
}