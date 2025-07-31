// GitHub Repository Fetcher with Language Analytics
document.addEventListener('DOMContentLoaded', () => {
    
    let currentUsername = '';
    let currentPage = 1;
    let isLoading = false;
    const reposPerPage = 12;
    let allLanguages = {}; // Track all languages across repos
    
    // GitHub language colors (official)
    const languageColors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'Java': '#b07219',
        'TypeScript': '#2b7489',
        'C++': '#f34b7d',
        'C': '#555555',
        'C#': '#239120',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'Dart': '#00B4AB',
        'HTML': '#e34c26',
        'CSS': '#1572B6',
        'Shell': '#89e051',
        'Vue': '#4FC08D',
        'React': '#61DAFB',
        'Jupyter Notebook': '#DA5B0B',
        'R': '#198CE7',
        'MATLAB': '#e16737',
        'Scala': '#c22d40',
        'Perl': '#0298c3',
        'Objective-C': '#438eff',
        'Lua': '#000080',
        'Haskell': '#5e5086',
        'Clojure': '#db5855',
        'Erlang': '#B83998',
        'Elixir': '#6e4a7e',
        'F#': '#b845fc',
        'OCaml': '#3be133',
        'PowerShell': '#012456',
        'Dockerfile': '#384d54',
        'Makefile': '#427819'
    };
    
    // Elements
    const githubRepos = document.getElementById('githubRepos');
    const githubLoader = document.getElementById('githubLoader');
    const githubError = document.getElementById('githubError');
    const usernameInput = document.getElementById('usernameInput');
    const searchBtn = document.getElementById('searchBtn');
    const currentUserDisplay = document.getElementById('currentUser');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    
    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    loadMoreBtn.addEventListener('click', loadMoreRepos);
    
    // Handle search functionality
    function handleSearch() {
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter a GitHub username');
            return;
        }
        
        if (username !== currentUsername) {
            currentUsername = username;
            currentPage = 1;
            allLanguages = {}; // Reset language tracking
            githubRepos.innerHTML = ''; // Clear existing repos
            loadMoreContainer.style.display = 'none';
            hideLanguageStats();
        }
        
        fetchGitHubRepos(currentUsername, currentPage, false);
    }
    
    // Load more repositories
    function loadMoreRepos() {
        currentPage++;
        fetchGitHubRepos(currentUsername, currentPage, true);
    }
    
    // Fetch GitHub repositories
    async function fetchGitHubRepos(username = currentUsername, page = 1, append = false) {
        if (isLoading) return;
        
        try {
            isLoading = true;
            
            if (!append) {
                showLoader();
                hideError();
            } else {
                loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
                loadMoreBtn.disabled = true;
            }
            
            const response = await fetch(
                `https://api.github.com/users/${username}/repos?sort=updated&per_page=${reposPerPage}&page=${page}`
            );
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('User not found');
                } else {
                    throw new Error(`Error ${response.status}: Failed to fetch repositories`);
                }
            }
            
            const repos = await response.json();
            
            if (!append) {
                updateCurrentUser(username);
            }
            
            // Fetch detailed language data for each repository
            const reposWithLanguages = await Promise.all(
                repos.map(async (repo) => {
                    try {
                        const langResponse = await fetch(repo.languages_url);
                        if (langResponse.ok) {
                            const languages = await langResponse.json();
                            repo.detailedLanguages = languages;
                            
                            // Update global language stats
                            Object.entries(languages).forEach(([lang, bytes]) => {
                                allLanguages[lang] = (allLanguages[lang] || 0) + bytes;
                            });
                        } else {
                            repo.detailedLanguages = {};
                        }
                    } catch (error) {
                        console.warn(`Failed to fetch languages for ${repo.name}:`, error);
                        repo.detailedLanguages = {};
                    }
                    return repo;
                })
            );
            
            displayRepos(reposWithLanguages, append);
            
            if (!append || currentPage === 1) {
                displayLanguageStats();
            }
            
            // Show/hide load more button based on results
            if (repos.length === reposPerPage) {
                loadMoreContainer.style.display = 'block';
            } else {
                loadMoreContainer.style.display = 'none';
            }
            
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            showError(error.message);
            loadMoreContainer.style.display = 'none';
        } finally {
            isLoading = false;
            hideLoader();
            resetLoadMoreButton();
        }
    }
    
    // Update current user display
    function updateCurrentUser(username) {
        currentUserDisplay.innerHTML = `<i class="fab fa-github"></i> @${username}`;
        currentUserDisplay.style.display = 'block';
    }
    
    // Display language statistics
    function displayLanguageStats() {
        const totalBytes = Object.values(allLanguages).reduce((sum, bytes) => sum + bytes, 0);
        const sortedLanguages = Object.entries(allLanguages)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10); // Top 10 languages
        
        if (sortedLanguages.length === 0) return;
        
        const statsHTML = `
            <div class="gil-language-stats">
                <h3><i class="fas fa-chart-pie"></i> Language Statistics</h3>
                <div class="gil-language-list">
                    ${sortedLanguages.map(([lang, bytes]) => {
                        const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                        const color = languageColors[lang] || '#586069';
                        return `
                            <div class="gil-language-stat">
                                <div class="gil-language-info">
                                    <span class="gil-language-dot" style="background-color: ${color}"></span>
                                    <span class="gil-language-name">${lang}</span>
                                    <span class="gil-language-percentage">${percentage}%</span>
                                </div>
                                <div class="gil-language-bar">
                                    <div class="gil-language-fill" style="width: ${percentage}%; background-color: ${color}"></div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        // Insert stats before repositories
        const existingStats = document.querySelector('.gil-language-stats');
        if (existingStats) {
            existingStats.innerHTML = statsHTML.match(/<div class="gil-language-stats">[\s\S]*<\/div>/)[0];
        } else {
            githubRepos.insertAdjacentHTML('beforebegin', statsHTML);
        }
    }
    
    // Hide language statistics
    function hideLanguageStats() {
        const existingStats = document.querySelector('.gil-language-stats');
        if (existingStats) {
            existingStats.remove();
        }
    }
    
    // Display repositories with detailed language info
    function displayRepos(repos, append = false) {
        if (repos.length === 0 && !append) {
            githubRepos.innerHTML = '<p class="gil-no-repos">No public repositories found.</p>';
            return;
        }
        
        const repoHTML = repos.map(repo => {
            const topics = repo.topics || [];
            const detailedLanguages = repo.detailedLanguages || {};
            
            const updatedAt = new Date(repo.updated_at);
            const formattedDate = updatedAt.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
            
            // Calculate language percentages for this repo
            const totalBytes = Object.values(detailedLanguages).reduce((sum, bytes) => sum + bytes, 0);
            const languageList = Object.entries(detailedLanguages)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5); // Top 5 languages per repo
            
            return `
                <div class="gil-github-repo">
                    <div class="gil-repo-header">
                        <h3 class="gil-repo-name">
                            <a href="${repo.html_url}" target="_blank">
                                <i class="fab fa-github"></i> ${repo.name}
                            </a>
                        </h3>
                    </div>
                    <div class="gil-repo-description">
                        <p>${repo.description || 'No description provided'}</p>
                    </div>
                    
                    ${languageList.length > 0 ? `
                    <div class="gil-repo-languages">
                        <div class="gil-language-breakdown">
                            ${languageList.map(([lang, bytes]) => {
                                const percentage = ((bytes / totalBytes) * 100).toFixed(1);
                                const color = languageColors[lang] || '#586069';
                                return `
                                    <div class="gil-repo-language-item">
                                        <span class="gil-language-dot" style="background-color: ${color}"></span>
                                        <span class="gil-language-text">${lang}</span>
                                        <span class="gil-language-percent">${percentage}%</span>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        <div class="gil-language-progress">
                            ${languageList.map(([lang, bytes]) => {
                                const percentage = (bytes / totalBytes) * 100;
                                const color = languageColors[lang] || '#586069';
                                return `<div class="gil-progress-segment" style="width: ${percentage}%; background-color: ${color}" title="${lang}: ${percentage.toFixed(1)}%"></div>`;
                            }).join('')}  
                        </div>
                    </div>
                    ` : (repo.language ? `
                    <div class="gil-repo-languages">
                        <div class="gil-language-breakdown">
                            <div class="gil-repo-language-item">
                                <span class="gil-language-dot" style="background-color: ${languageColors[repo.language] || '#586069'}"></span>
                                <span class="gil-language-text">${repo.language}</span>
                            </div>
                        </div>
                    </div>
                    ` : '')}
                    
                    <div class="gil-repo-meta">
                        <span class="gil-repo-updated"><i class="fas fa-history"></i> Updated: ${formattedDate}</span>
                    </div>
                    <div class="gil-repo-stats">
                        <span class="gil-repo-stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                        <span class="gil-repo-forks"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        ${repo.size ? `<span class="gil-repo-size"><i class="fas fa-hdd"></i> ${(repo.size / 1024).toFixed(1)} MB</span>` : ''}
                    </div>
                    ${topics.length > 0 ? `
                    <div class="gil-repo-topics">
                        ${topics.slice(0, 5).map(topic => `<span class="gil-repo-topic">${topic}</span>`).join('')}
                    </div>
                    ` : ''}
                </div>
            `;
        }).join('');
        
        if (append) {
            githubRepos.innerHTML += repoHTML;
        } else {
            githubRepos.innerHTML = repoHTML;
        }
    }
    
    // Helper functions
    function showLoader() {
        githubLoader.style.display = 'flex';
    }
    
    function hideLoader() {
        githubLoader.style.display = 'none';
    }
    
    function showError(message = 'Failed to fetch repositories') {
        githubError.innerHTML = `<p><i class="fas fa-exclamation-circle"></i> ${message}</p>`;
        githubError.style.display = 'block';
    }
    
    function hideError() {
        githubError.style.display = 'none';
    }
    
    function resetLoadMoreButton() {
        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Repositories';
        loadMoreBtn.disabled = false;
    }
    
    // Initial load
    fetchGitHubRepos();
}); 