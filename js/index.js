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


const toggleRepoLoader = () => {
    repoLoader.classList.toggle('hidden')
    repoLoader.classList.toggle('flex-center')
    repositories.classList.toggle('hidden')
    repositories.classList.toggle('flex')
}


document.addEventListener('click', (e) => {
    if (e.target.id == 'setPerPage') changePerPage()
    if (e.target.id == 'goFirst') goFirst()
    if (e.target.id == 'prevPage') prevPage()
    if (e.target.id == 'nextPage') nextPage()
    if (e.target.id == 'goLast') goLast()
})

//Funtion to change the number of items to be displayed
const changePerPage = async () => {
    const itemsPerPage = document.getElementById('itemsPerPage')
    perPage = itemsPerPage?.value
    if (perPage < 1) alert("Items per page can't be less than 1")
    else if (perPage > 100) alert("Items per page can't be more than 100")
    else {
        toggleRepoLoader()
        repos = await getRepos(perPage, page)
        toggleRepoLoader()
        loadPagination()
        loadRepos(repos)
        getTotalPages()
    }
}

//Function to calculate total number of pages
const getTotalPages = () => {
    totalPages = Math.floor(totalRepos / perPage)
    if (totalRepos % perPage !== 0) totalPages++
    loadPagination()
}

//Pagination
const goFirst = async () => {
    if (page == 1) return
    toggleRepoLoader()
    repos = await getRepos(perPage, 1)
    toggleRepoLoader()
    loadRepos(repos)
    loadPagination()
}

const goLast = async () => {
    if (page == totalPages) return
    page = totalPages
    toggleRepoLoader()
    repos = await getRepos(perPage, page)
    toggleRepoLoader()
    loadRepos(repos)
    loadPagination()
}

const nextPage = async () => {
    if (page == totalPages) return
    page++
    toggleRepoLoader()
    repos = await getRepos(perPage, page)
    toggleRepoLoader()
    loadRepos(repos)
    loadPagination()
}

const prevPage = async () => {
    if (page == 1) return
    page--
    toggleRepoLoader()
    repos = await getRepos(perPage, page)
    toggleRepoLoader()
    loadRepos(repos)
    loadPagination()
}

const loadPagination = () => {
    perPageWrapper.innerHTML = `
        <div class="flex-center gap-3 ">Enter number of items to display per page: <input
            type="number" name="itemsPerPage" id="itemsPerPage"
            class="itemsPerPageInput" value=${perPage}></input>
            <button id="setPerPage" class="submitBtn">Submit</button>
        </div>
    `
    pagination.innerHTML = `
    <div class='flex-center'>
        <button
        id="goFirst"
        class='paginationBtn ${page == 1 ? 'disabledBtn' : ''}'>First</button>
        
        <button  
        id="prevPage"
        class='paginationBtn ${page == 1 ? 'disabledBtn' : ''}'>Prev</button>

        <div id="currentPage" class='paginationBtn'>${page}</div>

        <button  
        id="nextPage"
        class='paginationBtn ${page === totalPages ? 'disabledBtn' : ''}'>Next</button>

        <button  
        id="goLast"
        class='paginationBtn ${page === totalPages ? 'disabledBtn' : ''}'>Last</button>
    </div>
    `
}


//Display Repositories
const loadRepos = (repos) => {
    const displayRepos = repos?.map((repo, index) => (
        `
        <a id="repoLink" href=${repo.html_url} target="_blank">
            <div class="repo-wrapper" key=${index}>
                <p class="repo-name">${repo.name}</p>
                <p class="repo-description">Description: ${repo.description ? repo.description : "-"}</p>
                <div class="flex">
                ${repo.language ? `
                <div class="repo-language">${repo.language}</div>
                `: ``}
                </div>
            </div>
        </a>
        `
    )).join('')

    repositories.innerHTML = displayRepos


}

getUserBtn.addEventListener('click', async () => {
    contentLoader.classList.toggle('hidden')
    contentLoader.classList.toggle('flex-center')
    data = await getInfo()
    contentLoader.classList.toggle('flex-center')
    contentLoader.classList.toggle('hidden')
    if (data != null) {
        repos = await getRepos(perPage, page)
        totalRepos = data.public_repos
        getTotalPages()

        about.innerHTML = `
        <div id="avatarWrapper" class="flex-center ">
            <img src=${data.avatar_url} alt="pfp" class=""
            id="avatar" />
        </div>
        <div id="userInfo" class="flex">
            <p id="userInfoName" class="">${data.name}</p>
            <div id="location" class="flex gap-3">
            <i class="fa-solid fa-location-dot "></i>
            <p>${data.location ? data.location : '-'}</p>
            </div>
            <p class="">Bio: ${data.bio ? data.bio : "-"}</p>
            <p class="">Twitter: ${data.twitter_username ? `<a href="https://twitter.com/${data.twitter_username}" target="_blank">https://twitter.com/${data.twitter_username}</a>` : "-"}</p>
        </div>
        `
        githubUrl.innerHTML = `
        <i class="fa-solid fa-link"></i>
        <a href=${data.url}>${data.url}</a>
        `
        loadRepos(repos)
        loadPagination()
    }
})