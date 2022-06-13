import {
    APIApplicationCommandRoleOption, ApplicationCommandOptionType
} from 'discord-api-types/v10';

import { CommandBasicOption, CommandType } from '../CommandInterface';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';

export class CommandRoleOption extends ApplicationCommandOptionBase {
  public override readonly type = ApplicationCommandOptionType.Role as const;

  public toSlash(): APIApplicationCommandRoleOption {
    this.runRequiredValidations();

    return { ...this };
  }

  public toCommand(): CommandBasicOption {
    this.runRequiredValidations();

    return {
      name: this.name,
      description: this.description.length > 0 ? this.description : 'The role to you want to use.',
      type: CommandType.Role,
      required: this.required ?? false,
    };
  }
}
