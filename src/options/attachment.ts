import {
    APIApplicationCommandAttachmentOption, ApplicationCommandOptionType
} from 'discord-api-types/v10';

import { CommandBasicOption, CommandType } from '../CommandInterface';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';

export class CommandAttachmentOption extends ApplicationCommandOptionBase {
  public override readonly type = ApplicationCommandOptionType.Attachment as const;

  public toSlash(): APIApplicationCommandAttachmentOption {
    this.runRequiredValidations();

    return { ...this };
  }

  public toCommand(): CommandBasicOption {
    this.runRequiredValidations();

    return {
      name: this.name,
      description: this.description.length > 0 ? this.description : 'The attachment to you want to use.',
      type: CommandType.Attachment,
      required: this.required ?? false,
    };
  }
}
