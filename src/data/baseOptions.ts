import { InteractionOptions } from './interactionOptions';
import { MessageOptions } from './messageOptions';

export class BaseOptions {
  isInteraction(): this is InteractionOptions {
    return this instanceof InteractionOptions;
  }
  isMessage(): this is MessageOptions {
    return this instanceof MessageOptions;
  }
  constructor() {}
}
