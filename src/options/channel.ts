import {
    APIApplicationCommandChannelOption, ApplicationCommandOptionType
} from 'discord-api-types/v10';
import { mix } from 'ts-mixer';

import { CommandBasicOption, CommandType } from '../CommandInterface';
import { ApplicationCommandOptionBase } from '../mixins/ApplicationCommandOptionBase';
import {
    ApplicationCommandOptionChannelTypesMixin
} from '../mixins/ApplicationCommandOptionChannelTypesMixin';

@mix(ApplicationCommandOptionChannelTypesMixin)
export class CommandChannelOption extends ApplicationCommandOptionBase {
  public override readonly type = ApplicationCommandOptionType.Channel as const;

  public toSlash(): APIApplicationCommandChannelOption {
    this.runRequiredValidations();

    return { ...this };
  }

  public toCommand(): CommandBasicOption {
    this.runRequiredValidations();

    return {
      name: this.name,
      description: this.description.length > 0 ? this.description : 'The channel to you want to use.',
      type: CommandType.Channel,
      channelTypes: this.channel_types ?? [],
      required: this.required ?? false,
    };
  }
}

export interface CommandChannelOption extends ApplicationCommandOptionChannelTypesMixin {}
