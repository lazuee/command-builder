import {
    APIApplicationCommandStringOption, ApplicationCommandOptionType
} from 'discord-api-types/v9';

import { CommandBasicOption, CommandType } from '../CommandInterface';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';

export class CommandMessageOption extends ApplicationCommandOptionBase {
  public readonly type = ApplicationCommandOptionType.String as const;

  public toSlash(): APIApplicationCommandStringOption {
    this.runRequiredValidations();

    return { ...this };
  }

  public toCommand(): CommandBasicOption {
    this.runRequiredValidations();

    return {
      name: this.name,
      description: this.description.length > 0 ? this.description : 'The message that will be used for this option.',
      type: CommandType.Message,
      required: this.required ?? false,
    };
  }
}
