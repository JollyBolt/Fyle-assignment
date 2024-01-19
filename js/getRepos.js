export const getRepos = async(perPage=6,page=1)=>{
    const userName = document.getElementById('username').value
    try {
        const {data} = await axios.get(`https://api.github.com/users/${userName}/repos?per_page=${perPage}&page=${page}`)
        return data
    } catch (error) {
        console.log(error)
    }
}