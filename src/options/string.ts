import {
    APIApplicationCommandStringOption, ApplicationCommandOptionType
} from 'discord-api-types/v10';
import { mix } from 'ts-mixer';

import { CommandBasicOption, CommandType } from '../CommandInterface';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';
import {
    ApplicationCommandOptionWithChoicesAndAutocompleteMixin
} from '../mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin';

@mix(ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
export class CommandStringOption extends ApplicationCommandOptionBase {
  public readonly type = ApplicationCommandOptionType.String as const;

  public toSlash(): APIApplicationCommandStringOption {
    this.runRequiredValidations();

    if (this.autocomplete && Array.isArray(this.choices) && this.choices.length > 0) {
      throw new RangeError('Autocomplete and choices are mutually exclusive to each other.');
    }

    return { ...this };
  }

  public toCommand(): CommandBasicOption {
    this.runRequiredValidations();

    return {
      name: this.name,
      description: this.description.length > 0 ? this.description : 'The string value of this option.',
      type: CommandType.String,
      required: this.required ?? false,
    };
  }
}

export interface CommandStringOption extends ApplicationCommandOptionWithChoicesAndAutocompleteMixin<string> {}
