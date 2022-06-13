import {
    APIApplicationCommandBooleanOption, ApplicationCommandOptionType
} from 'discord-api-types/v10';

import { CommandBasicOption, CommandType } from '../CommandInterface';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';

export class CommandBooleanOption extends ApplicationCommandOptionBase {
  public readonly type = ApplicationCommandOptionType.Boolean as const;

  public toSlash(): APIApplicationCommandBooleanOption {
    this.runRequiredValidations();

    return { ...this };
  }

  public toCommand(): CommandBasicOption {
    this.runRequiredValidations();

    return {
      name: this.name,
      description: this.description.length > 0 ? this.description : 'Is is true or false?',
      type: CommandType.Boolean,
      required: this.required ?? false,
    };
  }
}
