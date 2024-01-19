export const getInfo = async() =>{
    const userName = document.getElementById('username').value
    if(userName.length == 0) {
        alert("Please enter a username") 
        return null
    }
    try {
        const response = await fetch(`https://api.github.com/users/${userName}`)
        const data = await response.json()
        console.log(data)
        return data
    } catch (error) {
        alert("Username not found")
    }
}