import type { Command } from '../Command';
import type { CommandInteraction, InteractionReplyOptions } from 'discord.js';
import { CommandTriggerBase } from './base';
import { InteractionOptions } from './interactionOptions';

export class CommandTriggerInteraction extends CommandTriggerBase {
  declare data: CommandInteraction<'cached'>;
  constructor(command: Command, data: CommandInteraction<'cached'>) {
    super(command, data);
  }

  get options() {
    return new InteractionOptions(this);
  }

  get editReply() {
    return this.data.editReply;
  }

  override reply(options: string | InteractionReplyOptions) {
    return super.reply(options) as Promise<true>;
  }
}
