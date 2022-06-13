import type { Message, ReplyMessageOptions } from 'discord.js';
import type { Command } from '../Command';
import { CommandTriggerBase } from './base';
import { MessageOptions } from './messageOptions';

export class CommandTriggerMessage extends CommandTriggerBase {
  declare data: Message<boolean>;
  constructor(command: Command, data: Message<boolean>) {
    super(command, data);
  }

  get options() {
    return new MessageOptions(this);
  }

  get content() {
    return this.data.content;
  }

  get cleanContent() {
    return this.data.cleanContent;
  }

  override reply(options: string | ReplyMessageOptions) {
    return super.reply(options) as Promise<Message<boolean>>;
  }
}
