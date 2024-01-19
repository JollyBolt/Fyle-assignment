export const getRepos = async(perPage=6,page=1)=>{
    const userName = document.getElementById('username').value
    try {
        const response = await fetch(`https://api.github.com/users/${userName}/repos?per_page=${perPage}&page=${page}`)
        const data = await response.json()
        return data
    } catch (error) {
        console.log(error)
    }
}