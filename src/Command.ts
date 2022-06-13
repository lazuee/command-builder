import { isMessageInstance, runsOnInteraction } from '@sapphire/discord.js-utilities';

import { CommandBuilder } from './CommandBuilder';
import { CommandError } from './CommandError';
import { CommandStore } from './CommandStore';
import { CommandTriggerInteraction, CommandTriggerMessage } from './data';

import type { Awaitable, Client, CommandInteraction, Message, MessageOptions, MessagePayload, PermissionString } from 'discord.js';

const capitalize = <T extends string>(str: T) => (str[0]?.toUpperCase() + str.slice(1)) as Capitalize<T>;

export type CommandTrigger = CommandTriggerInteraction | CommandTriggerMessage;
export type CommandExecutor = (this: Client, CommandTrigger: CommandTrigger) => Awaitable<void>;
export type CommandOptionType = Extract<keyof CommandBuilder, `add${string}Option`> extends `add${infer U}Option` ? Lowercase<U> : never;
export type CommandOptionArgs<T extends CommandOptionType> = Parameters<CommandBuilder[`add${Capitalize<T>}Option`]>;
export type ReplyMessageOptions = string | MessagePayload | MessageOptions;

declare module 'discord.js' {
  interface Client {
    debug: boolean;
  }
}

export class Command {
  readonly #command = new CommandBuilder();
  #executor: CommandExecutor = function () {
    return Promise.reject(new CommandError('NO_EXECUTOR', 'Set an executor for this command'));
  };
  memberPermissions: PermissionString[] = [];
  botPermissions: PermissionString[] = [];

  constructor(public readonly name: string, public readonly description = '') {
    this.#command.setName(this.name).setDescription(this.description);

    const contructor = this.constructor as typeof Command;
    if (!(contructor.prototype instanceof Command || contructor === Command)) {
      CommandStore.addCommandError(this.name, new CommandError('NO_EXTEND_COMMAND', "Don't extend Command class"));
    }
  }

  setExecutor(executor: CommandExecutor) {
    this.#executor = executor;
    return this;
  }

  addOption<T extends CommandOptionType>(type: T, ...args: CommandOptionArgs<T>) {
    const fn = this.#command[`add${capitalize(type)}Option`].bind(this.#command) as (...a: typeof args) => void;
    fn(...args);
    return this;
  }

  addSubCommand(...args: Parameters<CommandBuilder['addSubcommand']>) {
    this.#command.addSubcommand(...args);
    return this;
  }

  addSubcommandGroup(...args: Parameters<CommandBuilder['addSubcommandGroup']>) {
    this.#command.addSubcommandGroup(...args);
    return this;
  }

  addMemberPermissions(...permissions: PermissionString[]) {
    this.memberPermissions.push(...permissions);
    this.#command.setMemberPermissions(...permissions);
    return this;
  }

  addBotPermissions(...permissions: PermissionString[]) {
    this.botPermissions.push(...permissions);
    this.#command.setBotPermissions(...permissions);
    return this;
  }

  readonly toSlash: CommandBuilder['toSlash'] = (() => {
    return this.#command.toSlash.bind(this.#command);
  })();

  readonly toCommand: CommandBuilder['toCommand'] = (() => {
    return this.#command.toCommand.bind(this.#command);
  })();

  async start(data: Message<boolean> | CommandInteraction<'cached'>): Promise<void> {
    let CommandTrigger: CommandTrigger | null = null;

    if (runsOnInteraction(data)) CommandTrigger = new CommandTriggerInteraction(this, data);
    else if (isMessageInstance(data)) CommandTrigger = new CommandTriggerMessage(this, data);

    if (CommandTrigger) {
      try {
        if (!CommandTrigger.author?.bot || CommandTrigger.author?.id !== CommandTrigger.client?.user?.id) {
          if (CommandTrigger.guild && !CommandTrigger.member) {
          }
        }
        if (data && CommandTrigger.author) await this.#executor.bind(CommandTrigger.client)(CommandTrigger);
      } catch (error: any) {
        //@ts-ignore
        const message = error?.message || error;
        CommandStore.addCommandError(this.name, new CommandError('EXECUTOR_ERROR', `${message}`));

        throw new Error(error);
      } finally {
        let errors = [...CommandStore.errors.values()].filter(error => error.name === this.name);
        CommandStore.errors.sweep(error => error.name === this.name);

        if (errors.length > 0) {
          let errorMessage = `${this.name} command has following errors:\n`;
          for (const { error } of errors ?? []) errorMessage += `${error.message}\n`;

          if (CommandTrigger.channel?.isText()) CommandTrigger.channel?.send(errorMessage).catch(() => {});
          else if (CommandTrigger.author?.dmChannel) CommandTrigger.author?.dmChannel.send(errorMessage).catch(() => {});
        }
      }

      return Promise.resolve();
    }

    return Promise.reject(new CommandError('START_ERROR', 'The data is not a Message or CommandInteraction'));
  }
}
