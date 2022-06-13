import {
    APIApplicationCommandIntegerOption, ApplicationCommandOptionType
} from 'discord-api-types/v10';
import { mix } from 'ts-mixer';

import { s } from '@sapphire/shapeshift';

import { CommandBasicOption, CommandType } from '../CommandInterface';
import {
    ApplicationCommandNumericOptionMinMaxValueMixin
} from '../mixins/ApplicationCommandNumericOptionMinMaxValueMixin';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';
import {
    ApplicationCommandOptionWithChoicesAndAutocompleteMixin
} from '../mixins/ApplicationCommandOptionWithChoicesAndAutocompleteMixin';

const numberValidator = s.number.int;

@mix(ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin)
export class CommandIntegerOption extends ApplicationCommandOptionBase implements ApplicationCommandNumericOptionMinMaxValueMixin {
  public readonly type = ApplicationCommandOptionType.Integer as const;

  public setMaxValue(max: number): this {
    numberValidator.parse(max);

    Reflect.set(this, 'max_value', max);

    return this;
  }

  public setMinValue(min: number): this {
    numberValidator.parse(min);

    Reflect.set(this, 'min_value', min);

    return this;
  }

  public toSlash(): APIApplicationCommandIntegerOption {
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
      description: this.description.length > 0 ? this.description : 'The integer value of this option.',
      type: CommandType.Integer,
      min: this.min_value ?? null,
      max: this.max_value ?? null,
      required: this.required ?? false,
    };
  }
}

export interface CommandIntegerOption extends ApplicationCommandNumericOptionMinMaxValueMixin, ApplicationCommandOptionWithChoicesAndAutocompleteMixin<number> {}
