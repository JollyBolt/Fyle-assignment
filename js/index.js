import { getInfo } from "./getInfo.js";
import { getRepos } from "./getRepos.js";

//DOM elements
const getUserBtn = document.getElementById('getUser')
const about = document.getElementById('about')
const githubUrl = document.getElementById('githubUrl')
const repositories = document.getElementById('repositories')
const pagination = document.getElementById('pagination')
const perPageWrapper = document.getElementById('perPageWrapper')
const contentLoader = document.getElementById('contentLoader')
const repoLoader = document.getElementById('repoLoader')


//Variables
var data = {}
var repos = []
var page = 1
var perPage = 6
var totalRepos
var totalPages


const toggleRepoLoader = () =>{
    repoLoader.classList.toggle('hidden')
    repoLoader.classList.toggle('flex')
    repositories.classList.toggle('hidden')
    repositories.classList.toggle('flex')
}


document.addEventListener('click',(e)=>{
    if(e.target.id=='setPerPage') changePerPage()
    if(e.target.id=='goFirst') goFirst()
    if(e.target.id=='prevPage') prevPage()
    if(e.target.id=='nextPage') nextPage()
    if(e.target.id=='goLast') goLast()
})

//Funtion to change the number of items to be displayed
const changePerPage = async () => {
    perPage = await document.getElementById('itemsPerPage')?.value
    if (perPage == 0) alert("Items per page can't be 0")
    else if (perPage > 100) alert("Items per page can't be more than 100")
    else {
        toggleRepoLoader()
        repos = await getRepos(perPage, page)
        toggleRepoLoader()
        loadRepos(repos)
        getTotalPages()
    }
}

//Function to calculate total number of pages
const getTotalPages = () =>{
    totalPages = Math.floor(totalRepos/perPage)
    if(totalRepos%perPage!==0) totalPages++
    loadPagination()
}

//Pagination
const goFirst = async() => {
    if(page==1) return
    toggleRepoLoader()
    repos = await getRepos(perPage, 1)
    toggleRepoLoader()
    loadRepos(repos)
    loadPagination()
}

const goLast = async() => {
    if(page==totalPages) return
    page=totalPages
    toggleRepoLoader()
    repos = await getRepos(perPage, page)
    toggleRepoLoader()
    loadRepos(repos)
    loadPagination()
}

const nextPage = async() => {
    if(page==totalPages) return
    page++
    toggleRepoLoader()
    repos = await getRepos(perPage, page)
    toggleRepoLoader()
    loadRepos(repos)
    loadPagination()
}

const prevPage = async() => {
    if(page==1) return
    page--
    toggleRepoLoader()
    repos = await getRepos(perPage, page)
    toggleRepoLoader()
    loadRepos(repos)
    loadPagination()
}

const loadPagination = () => {
    perPageWrapper.innerHTML = `
        <div class="flex gap-3 justify-center items-center">Enter number of items to display per page: <input
            type="number" name="itemsPerPage" id="itemsPerPage"
            class="border-2 py-1 pl-2 focus:outline-none w-[80px]" value="6"></input>
            <button id="setPerPage" class="border rounded-md p-2">Submit</button>
        </div>
    `
    pagination.innerHTML = `
    <div class='flex justify-center items-center'>
        <button
        id="goFirst"

        class='py-2 px-3 border-x border-y rounded-l-lg font-bold text-xl ${page==1?'opacity-40 cursor-default':'cursor-pointer'}'
        >First</button>

        <button  
        id="prevPage"

        class='py-2 px-3 border-r border-y font-bold text-xl ${page==1?'opacity-40 cursor-default':'cursor-pointer'}'>Prev</button>

        <div class='py-2 px-4 border-r border-y font-bold text-xl'>${page}</div>

        <button  
        id="nextPage"
  
        class='py-2 px-3 border-r border-y font-bold text-xl ${page===totalPages?'opacity-40 cursor-default':'cursor-pointer'}'>Next</button>

        <button  
        id="goLast"
        class='py-2 px-3 border-r border-y font-bold text-xl rounded-r-lg ${page===totalPages?'opacity-40 cursor-default':'cursor-pointer'}'>Last</button>
    </div>
    `
}


//Display Repositories
const loadRepos = (repos) => {
    const displayRepos = repos?.map((repo, index) => (
        `
        <a href=${repo.html_url} target="_blank">
            <div class="w-[40vw] my-2 border-2 p-3 overflow-hidden" key=${index}>
                <p class="font-black text-xl text-blue-500 ml-2">${repo.name}</p>
                <p class="ml-2">Description: ${repo.description ? repo.description : "-"}</p>
                <div class="flex">
                ${repo.language ? `
                <div class="ml-2 p-1 text-white bg-blue-800 rounded-md">${repo.language}</div>
                `: ``}
                    
                </div>
            </div>
        </a>
        `
    )).join('')

    repositories.innerHTML =`
    <div id="repoLoader" class='relative w-[100vw] h-[50vh] hidden justify-center items-center'>
    <div class="absolute h-[250px] w-[250px] bg-white rounded-lg border-4 flex justify-center items-center">
        Loading...
    </div>
</div>
    `+ displayRepos

}

getUserBtn.addEventListener('click', async () => {
    contentLoader.classList.toggle('hidden')
    contentLoader.classList.toggle('flex')
    data = await getInfo()
    contentLoader.classList.toggle('flex')
    contentLoader.classList.toggle('hidden')
    repos = await getRepos(perPage, page)
    totalRepos = data.public_repos
    getTotalPages()

    about.innerHTML = `
        <div class="flex justify-center">
            <img src=${data.avatar_url} alt="pfp" class="rounded-full w-44 border-4" />
        </div>
        <div class="w-[60vw] px-10 text-xl">
            <p class="text-5xl font-black mb-3">${data.name}</p>
            <div class="flex gap-3">
            <i class="fa-solid fa-location-dot text-2xl"></i>
            <p>${data.location?data.location:'-'}</p>
            </div>
            <p class="mt-4">Bio: ${data.bio ? data.bio : "-"}</p>
            <p class="mt-2">Twitter: ${data.twitter_username ? `https://twitter.com/${data.twitter_username}` : "-"}</p>
        </div>
    `
    githubUrl.innerHTML = `
        <i class="fa-solid fa-link"></i>
        <a href=${data.url}>${data.url}</a>
    `
    loadRepos(repos)
    loadPagination()
})