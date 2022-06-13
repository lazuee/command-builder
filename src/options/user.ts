import {
    APIApplicationCommandUserOption, ApplicationCommandOptionType
} from 'discord-api-types/v10';

import { CommandBasicOption, CommandType } from '../CommandInterface';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';

export class CommandUserOption extends ApplicationCommandOptionBase {
  public readonly type = ApplicationCommandOptionType.User as const;

  public toSlash(): APIApplicationCommandUserOption {
    this.runRequiredValidations();

    return { ...this };
  }

  public toCommand(): CommandBasicOption {
    this.runRequiredValidations();

    return {
      name: this.name,
      description: this.description.length > 0 ? this.description : 'The user to you want to use.',
      type: CommandType.User,
      required: this.required ?? false,
    };
  }
}
