import type { CommandTriggerMessage } from '..';
import { BaseOptions } from './baseOptions';

export class MessageOptions extends BaseOptions {
  message: CommandTriggerMessage;
  constructor(message: CommandTriggerMessage) {
    super();
    this.message = message;
  }
}
