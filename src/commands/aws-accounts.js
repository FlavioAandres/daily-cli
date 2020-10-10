const { Command, flags } = require("@oclif/command");
const AWSCredentials = require("manage-aws-credentials");
const { Input } = require('enquirer')
const Table = require('cli-table3');

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

  InputName = (action)=>new Input({
    message: "What name you wants to " + action,
    initial: 'random-user'
  });
  InputSecretKey = ()=> new Input({
    message: "=> Secret Key",
    initial: 'uuiid/uuid@uuid:random',
    required: true,
  });
  InputAccsessKey = ()=> new Input({
    message: "=> Access Key",
    initial: 'AKIA123456',
    required: true,
  });

  handleAddAction = async ({name, key, secret})=>{
    if(!name){
      name = await this.InputName('add').run()
    }
    if(!key){
      key = await this.InputAccsessKey().run()
    }
    if(!secret){
      secret = await this.InputSecretKey().run()
    }

    AWSCredentials.add_profile(name, {
      access_key: key,
      secret_access_key: secret,
    });
    const fileSaved = AWSCredentials.save_file();
    this.log(
      fileSaved === 1
        ? `Your Account ${name} was successfully saved`
        : "There were issues saving your new account"
    );
  }

  handleRemoveAction = async({name}) =>{
    if (!name) {
      name = await this.InputName('remove').run()
    }
    AWSCredentials.delete_profile(name);
    const fileSaved = AWSCredentials.save_file();
    this.log(
      fileSaved === 1
        ? `Your Account ${name} was successfully deleted`
        : "There were issues removing your new account"
    );
  }

  handleShowAction = async () =>{
    const users_aws = AWSCredentials.serialize_credentials("object") || []; 
    
    const AccountsTable = new Table({
      head: ["Account Name", "Access Key"]
    });
    const parsedData = users_aws.map(user=>[user.name.replace(/(\[)|(\])/g, ''), user.access_key])
    AccountsTable.push(...parsedData);

    this.log(AccountsTable.toString())
  }  

  handleToAction = async ({name})=>{
    if (!name) {
      name = await this.InputName('move').run()
    }
    const credentials = AWSCredentials.serialize_credentials("object");
    
    //Look for the new default profile
    const credentialFilter = credentials.filter(
      (_credential) =>{
        return _credential.name.replace(/(\[)|(\])/g, '') === name
      }
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
    }else{
      throw new Error(
        `Looks like that there is not a profile with the given name, use the command aws-accounts show to get the list of current profiles`
      );
    }
    
  }

  async run() {
    const { flags, args } = this.parse(AWSAccounts);
    const {
      name, 
    } = flags

    switch (args.action) {
      case "add": {
        return await this.handleAddAction(flags)        
      }
      case "remove": {
        return await this.handleRemoveAction(flags)
      }
      case "show": {
        return this.handleShowAction()
      }
      case "to": {
        return this.handleToAction(flags)
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
