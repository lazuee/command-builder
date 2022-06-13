import type { APIApplicationCommandBasicOption, ApplicationCommandOptionType } from 'discord-api-types/v10';
import {
    validateLocalizationMap, validateRequired, validateRequiredParameters
} from '../Assertions';
import { SharedNameAndDescription } from './NameAndDescription';

import type { CommandBasicOption } from '../CommandInterface';

export abstract class ApplicationCommandOptionBase extends SharedNameAndDescription {
  public abstract readonly type: ApplicationCommandOptionType;

  public readonly required: boolean = false;

  public setRequired(required: boolean) {
    validateRequired(required);

    Reflect.set(this, 'required', required);

    return this;
  }

  public abstract toSlash(): APIApplicationCommandBasicOption;

  public abstract toCommand(): CommandBasicOption;

  protected runRequiredValidations() {
    validateRequiredParameters(this.name, this.description, []);

    validateLocalizationMap(this.name_localizations);
    validateLocalizationMap(this.description_localizations);

    validateRequired(this.required);
  }
}
