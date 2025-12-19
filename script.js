document.addEventListener('DOMContentLoaded', () => {
    const APIURL = 'https://api.github.com/users/';
    const form = document.getElementById('github-form');
    const result = document.getElementById('result');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username-input').value.trim();
        if (!username) {
            return;
        }
        const response = await fetch(APIURL + username);
        const data = await response.json();
        const bio = data.bio || '';
        console.log(data);

        if (data.message === 'Not Found') {
            result.innerHTML = '<p>Usuario no encontrado</p>';
            return;
        }
        if (data.message && data.message.includes('API rate limit exceeded')) {
            result.innerHTML = '<p>API request limit reached. Please wait 1 hour.</p>';
            return;
        }

        const reposResponse = await fetch(APIURL + username + '/repos?sort=updated');
        const repos = await reposResponse.json();
        const recentRepos = repos.slice(0, 5);

        const reposHTML = recentRepos.map(repo => {
            return `<a href="${repo.html_url}" target="_blank" class="repo">
                        ${repo.name}
                    </a>`;
        }).join('');

        result.innerHTML = `
            <div class="profile-card horizontal">
                <div class="avatar-wrapper">
                    <a href="${data.html_url}" target="_blank">
                        <img 
                            src="${data.avatar_url}" 
                            alt="${data.name || data.login} avatar" 
                            class="avatar"
                        >
                        <div class="avatar-overlay">Ver perfil</div>
                    </a>
                </div>

                <div class="profile-info">
                    <div class="name-twitter">
                        <p class="name">${data.name || data.login}</p>
                        ${data.twitter_username ? `
                            <a href="https://twitter.com/${data.twitter_username}" target="_blank" class="twitter">
                                <i class="fab fa-twitter"></i> @${data.twitter_username}
                            </a>
                        ` : ''}
                    </div>
                    ${bio ? `<p class="bio">${bio}</p>` : ''}
                    <div class="stats">
                        <p>${data.followers} Followers</p>
                        <p>${data.following} Following</p>
                        <p>${data.public_repos} Repos</p>
                    </div>
                    <div class="repos">
                        ${reposHTML}
                    </div>
                </div>
            </div>`;
    });
});
