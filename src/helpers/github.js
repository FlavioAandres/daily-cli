const { Octokit } = require("@octokit/rest");


module.exports = class Github {
  constructor(token) {
    this.octokit = new Octokit({
      auth: token,
    });
  }

  async listRepositories(options) {
    const defOptions = {
      per_page: options && options.per_page ? options.per_page : null,
      type: options && options.type ? options.type : null
    };

    const repositoriesList = []
    let lastPage = 0;
    let currentPage = 1

    while (lastPage < currentPage) {
      const response = await this.octokit.repos.listForAuthenticatedUser({ per_page: defOptions.per_page, type: defOptions.type, page: currentPage });

      repositoriesList.push(...response.data)

      lastPage = currentPage
      currentPage = this.extractNextPage(response.headers)
    }




    const repositories = repositoriesList.reduce(
      (repositoriesArray, currentRepository) => {

        const repository = {
          name: currentRepository.name,
          owner: currentRepository.owner.login,
          fullname: currentRepository.full_name,
          private: currentRepository.private,
          url: currentRepository.html_url,
          description: currentRepository.description,
          fork: currentRepository.fork,
          created_at: currentRepository.created_at,
          updated_at: currentRepository.updated_at,
          pushed_at: currentRepository.pushed_at,
          starts: currentRepository.stargazers_count,
          forks: currentRepository.forks_count,
          watchers: currentRepository.watchers,
          language: currentRepository.language,
          archived: currentRepository.archived,
          disabled: currentRepository.disabled,
          issues: currentRepository.open_issues,
          license: currentRepository.license,
          admin: currentRepository.permissions && currentRepository.permissions.admin ? true : false
        };

        repositoriesArray.push(repository);
        return repositoriesArray;
      },
      []
    );

    return repositories;
  }

  async createRepository(options) {
    let response = await this.octokit.repos.createForAuthenticatedUser({
      name: options.name,
      description: options.description,
      private: options.private ? true : false,
      has_issues: options.has_issues,
      has_wiki: options.has_wiki,
      is_template: options.is_template,
      auto_init: options.auto_init,
      gitignore_template: options.gitignore
    });
    return response;
  }

  async deleteRepository(options) {
    let response = await this.octokit.repos.delete({
      owner: options.owner,
      repo: options.repo,

    })
    return response
  }

  async createRelease(options) {
    let response = await this.octokit.repos.createRelease({
      owner: options.owner,
      repo: options.repo,
      tag_name: options.tag_name,
      draft: options.draft,
      prerelease: options.prerelease
    })

    return response
  }

  extractNextPage(headers) {
    if (headers && headers.link) {
      const links = headers.link.split(',')[0].split(';')
      if (links[1].includes('next')) {
        const uri = links[0].replace('<', '').replace('>', '')
        const link = new URL(uri)
        return link.searchParams.get('page')
      }
      return -1
    }
  }
}
