const { Command, flags } = require("@oclif/command");
const AWSCredentials = require("manage-aws-credentials");

class AWSAccounts extends Command {
  static args = [
    {
      name: "action",
      required: true,
      hidden: false,
      options: ["add", "remove", "show", "to"],
      description: "action that will do the command",
    },
  ];

  async run() {
    const { flags, args } = this.parse(AWSAccounts);
    const name = flags.name;
    const access_key = flags.key;
    const secret_access_key = flags.secret;

    switch (args.action) {
      case "add": {
        if (name && access_key && secret_access_key) {
          AWSCredentials.add_profile(name, {
            access_key,
            secret_access_key,
          });
          const fileSaved = AWSCredentials.save_file();
          this.log(
            fileSaved === 1
              ? "Account successfully saved"
              : "There were an issue saving your new account"
          );
          break;
        }
        throw new Error(
          `The flags name, key, and secret are required, use the flag --help for documentation`
        );
      }
      case "remove": {
        if (name) {
          AWSCredentials.delete_profile(name);
          const fileSaved = AWSCredentials.save_file();
          this.log(
            fileSaved === 1
              ? "Account successfully removed"
              : "There were an issue removing your new account"
          );
          break;
        }
        throw new Error(
          `The flags name is required, use the flag --help for documentation`
        );
      }
      case "show": {
        this.log(AWSCredentials.serialize_credentials("object"));
        break;
      }
      case "to": {
        if (name) {
          //Get all profiles as a object
          const credentials = AWSCredentials.serialize_credentials("object");
          //Look for the new default profile
          const credentialFilter = credentials.filter(
            (_credential) =>
              _credential.name.replace("[", "").replace("]", "") === name
          );

          if (credentialFilter.length === 1) {
            const credential = credentialFilter[0];
            delete credential.name;

            //Editing the current default profile
            AWSCredentials.edit_profile("default", credential);

            //Save the new profile object
            const fileSaved = AWSCredentials.save_file();

            this.log(
              fileSaved === 1
                ? "Your default account was successfully switched"
                : "There were an issue switching your default account"
            );
            break;
          }
          throw new Error(
            `Looks like that there is not a profile with the given name, use the command aws-accounts show to get the list of current profiles`
          );
        }
        throw new Error(
          `The flags name is required, use the flag --help for documentation`
        );
      }
      default: {
        break;
      }
    }
  }
}

AWSAccounts.description = `Describe the command here
...
Allow administrating your AWS accounts
`;

AWSAccounts.flags = {
  name: flags.string({
    char: "n",
    description: "Name of the AWS account",
    default: undefined,
  }),
  key: flags.string({
    char: "k",
    description: "Access Key of the AWS account",
    default: undefined,
  }),
  secret: flags.string({
    char: "s",
    description: "Secret Access Key of the AWS account",
    default: undefined,
  }),
};

module.exports = AWSAccounts;
