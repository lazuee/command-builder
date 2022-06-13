import {
    APIApplicationCommandMentionableOption, ApplicationCommandOptionType
} from 'discord-api-types/v10';

import { CommandBasicOption, CommandType } from '../CommandInterface';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';

export class CommandMentionableOption extends ApplicationCommandOptionBase {
  public readonly type = ApplicationCommandOptionType.Mentionable as const;

  public toSlash(): APIApplicationCommandMentionableOption {
    this.runRequiredValidations();

    return { ...this };
  }

  public toCommand(): CommandBasicOption {
    this.runRequiredValidations();

    return {
      name: this.name,
      description: this.description.length > 0 ? this.description : 'Is is true or false?',
      type: CommandType.Mentionable,
      required: this.required ?? false,
    };
  }
}
