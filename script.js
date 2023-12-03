const APIURL = "https://api.github.com/users/";

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

getUser('Pilatis');


async function getUser(username) {//função assíncrona recebe como argumento um username
    const resp = await fetch(APIURL + username);//await guarda uma resposta de uma requisição fetch. fetch é usada para fazer requisições HTTP
    const respData = await resp.json();//depois de receber a resposta da requisisão, usamos a conversão dos dados para o formato JSON isso tranforma os dados em objetos JS utilizaveis

    createUserCard(respData);//passa os dados do usuário obtidos da API como argumento

    getRepos(username);
}//faz uma requisição para uma API com base no nome de usuário fornecido, recebe os dados do usuário, os processa e então invoca outras funções para criar o cartão do usuário

async function getRepos(username) {
    const resp = await fetch(APIURL + username + "/repos");
    const respData = await resp.json();

    addReposToCard(respData);
}

let repoNumber;

function createUserCard(user) {

    repoNumber = user.public_repos;
    const cardHTML = `
        <div class="card">
            <div>
                <img class="avatar" src="${user.avatar_url}" alt="${user.name}" />
            </div>
            <div class="user-info">
                <h2>${user.name}</h2>
                <h3>${user.login}</h3>
                <p>${user.bio}</p>

                <ul class="info">
                    <li>${user.followers}<strong>Followers</strong></li>
                    <li>${user.following}<strong>Following</strong></li>
                    <li>${user.public_repos}<strong>Repos</strong></li>
                </ul>

                <h2 class="repo-header">
                    Repositories <span class="repo-num">${user.public_repos}</span>
                </h2>

                <div id="repos"></div>
            </div>
        </div>
    `;

    main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
    const reposEl = document.getElementById("repos");

    repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, repoNumber)
        .forEach((repo) => {
            const repoEl = document.createElement("a");
            repoEl.classList.add("repo");

            repoEl.href = repo.html_url;
            repoEl.target = "_blank";
            repoEl.innerText = repo.name;

            reposEl.appendChild(repoEl);
        });
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const user = search.value;

    if (user) {
        getUser(user);

        search.value = "";
    }
});
