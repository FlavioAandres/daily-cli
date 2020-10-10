const { Github } = require("../helpers/github");
const { Command, flags } = require("@oclif/command");
const { cli } = require("cli-ux");
const { Select, Confirm, Input } = require('enquirer');
const fs = require("fs");
const path = require("path");


class GithubCommand extends Command {
  DEFAULT_CONFIG_FILE_NAME = "github";
  DEFAULT_CONFIG_FILE_PATH = "./../configs/github.json";
  configuration = {};
  static args = [
    {
      name: "action",
      required: true,
      hidden: false,
      options: ["list", "create", "delete", "configure", "create-release"],
      description: "action that will do the command",
    },
  ];

  static flags = {
    ...cli.table.flags(),
  };

  static description = `
  ...
  Github automatizated!!.

  > Set up your github token first: daily-cli github configure --github-token "TOKEN"

  Generate your token on this way https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token
  Required access: Repo
  `;

  repositoriesListPromp = (repositoriesFullNames) => new Select({
    name: "Repository",
    message: "Select a repository",
    type: "list",
    choices: [...repositoriesFullNames],
  })

  comfirmDeletePrompt = (repositoryToDelete) => new Confirm({
    name: 'delete',
    message: `Are you sure to delete the repository ${repositoryToDelete}?`,
    initial: true
  })

  tagNamePrompt = () => new Input({
    message: "What is the release tag name?"
  })

  comfirmReleasePromt = (action) => new Confirm({
    name: 'ReleaseAction',
    message: `Is this a ${action} release?`,
    initial: false
  })

  async init() {
    this.loadConfiguration();
    this.github = new Github(this.configuration.github_token);
  }

  async run() {
    const { args, flags } = this.parse(GithubCommand);

    switch (args.action) {
      case "configure": {
        if (flags.github_token) {
          this.configuration.github_token = flags.github_token;
          try {
            this.createFile(
              this.DEFAULT_CONFIG_FILE_NAME,
              JSON.stringify(this.configuration)
            );
            this.log(`✔ github token loaded`);
          } catch (error) {
            this.log(`❌ There was an error updating the config`, error);
          }
        } else {
          this.log(
            `❌ The flag github_token is required to perform this action, see daily-cli github --help`
          );
        }
        break;
      }
      case "list": {
        cli.action.start("Looking for your repositories");
        let repositories = await this.github.listRepositories();
        cli.action.stop();
        cli.table(
          repositories,
          {
            owner: {
              extended: true,
            },
            name: {},
            created_at: {
              get: (key) => new Date(key.created_at).toLocaleDateString(),
            },
            language: {},
            fullname: {
              extended: true,
            },
            license: {
              get: (key) => (key.license !== null ? key.license.key : "None"),
              extended: true,
            },
            private: {
              get: (key) => (key.private ? "yes" : "no"),
              extended: true,
            },
            url: {
              extended: true,
            },
            description: {
              extended: true,
            },
            fork: {
              get: (key) => (key.fork ? "yes" : "no"),
              extended: true,
            },
            starts: {
              extended: true,
            },
            forks: {
              extended: true,
            },
            watchers: {
              extended: true,
            },
            issues: {
              extended: true,
            },
            updated_at: {
              extended: true,
            },
            pushed_at: {
              extended: true,
            },
            archived: {
              get: (key) => (key.archived ? "yes" : "no"),
              extended: true,
            },
            disabled: {
              get: (key) => (key.disabled ? "yes" : "no"),
              extended: true,
            },
          },
          {
            printLine: this.log,
            ...flags, // parsed flags
          }
        );
        break;
      }
      case "create": {
        try {
          if (flags.repository) {
            let response = await this.github.createRepository({
              name: flags.repository,
              description: flags.description,
              private: flags.private,
              has_issues: flags.has_issues,
              has_wiki: flags.has_wiki,
              is_template: flags.is_template,
              auto_init: flags.auto_init,
              gitignore: flags.gitignore,
            });
            const logPrint =
              response && response.status == 201
                ? "✔ Repository created successfully"
                : `❌ There was an error at try to create the repository ${flags.repository}`;
            this.log(logPrint);
          } else {
            this.log(
              `❌ The flag repository is required to perform this action, see daily-cli github --help`
            );
          }
        } catch (error) {
          this.log(
            `❌ There was an error at try to create the repository ${flags.repository}`
          );
        }
        break;
      }
      case "delete": {
        try {
          cli.action.start("Looking for your repositories");
          let repositories = await this.github.listRepositories();
          cli.action.stop();

          const repositoriesAuthUser = repositories.filter(
            (repository) => repository.owner
          );

          const repositoriesFullNames = repositoriesAuthUser.map(repository => repository.fullname);

          let response = await this.repositoriesListPromp(repositoriesFullNames).run()

          const [owner, repo] = response.split("/");

          let confirmation = await this.comfirmDeletePrompt(response).run()

          if (confirmation) {
            const response = await this.github.deleteRepository({
              repo: repo,
              owner: owner,
            });
            const logPrint =
              response && response.status == 204
                ? "✔ Repository deleted successfully"
                : `❌ There was an error at try to delete the repository ${repositoryToDelete}}`;
            this.log(logPrint);
          }
        } catch (error) {
          this.log(
            `❌ There was an error at try to delete the repository`
          );
        }
        break;
      }
      case "create-release": {
        try {
          cli.action.start("Looking for your repositories");
          let repositories = await this.github.listRepositories();
          cli.action.stop();

          const repositoriesAuthUser = repositories.filter(
            (repository) => repository.owner
          );

          const repositoriesFullNames = repositoriesAuthUser.map(repository => repository.fullname);

          let response = await this.repositoriesListPromp(repositoriesFullNames).run()

          const [owner, repo] = response.split("/");

          let tag_name = await this.tagNamePrompt().run()

          let draftConfirm = await this.comfirmReleasePromt('draft').run()

          let prereleaseConfirm = await this.comfirmReleasePromt('pre-release').run()

          let releaseResponse = await this.github.createRelease({
            owner: owner,
            repo: repo,
            tag_name: tag_name,
            draft: draftConfirm,
            prerelease: prereleaseConfirm
          })

          const logPrint =
            releaseResponse && releaseResponse.status == 201
              ? "✔ Release created successfully"
              : `❌ There was an error at try to create the release ${tag_name}}`;
          this.log(logPrint);
        } catch (error) {
          this.log(
            `❌ There was an error at try to create the release`
          );
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  createFile(name, data) {
    const obsolutePath = path.join(__dirname, `/../configs/${name}.json`);
    fs.writeFileSync(obsolutePath, data);
  }

  loadConfiguration() {
    this.configuration =
      fs.existsSync(path.join(__dirname, this.DEFAULT_CONFIG_FILE_PATH)) &&
      require(this.DEFAULT_CONFIG_FILE_PATH);
    if (!this.configuration) {
      this.configuration = {};
    }
  }
}

GithubCommand.flags = {
  owner: flags.string({
    char: "o",
    description: "Repository Owner",
    default: undefined,
  }),
  repository: flags.string({
    char: "r",
    description: "Repository name",
    default: undefined,
  }),
  description: flags.string({
    char: "d",
    description: "Repository description",
    default: undefined,
  }),
  private: flags.string({
    char: "p",
    description: "Set repository private",
    default: false,
  }),
  has_issues: flags.string({
    char: "i",
    description: "Allow repository issues",
    default: true,
  }),
  has_projects: flags.string({
    description: "Allow repository project",
    default: true,
  }),
  has_wiki: flags.string({
    char: "w",
    description: "Allow repository wiki",
    default: true,
  }),
  is_template: flags.string({
    char: "t",
    description: "Set repository as a template",
    default: false,
  }),
  auto_init: flags.string({
    char: "a",
    description: "Create an initial README.md",
    default: false,
  }),
  gitignore: flags.string({
    description: "Set a gitignore template",
    default: undefined,
  }),
  github_token: flags.string({
    description: "Github token for github command.",
    default: undefined,
  }),
};
module.exports = GithubCommand;
