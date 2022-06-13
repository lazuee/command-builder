import { Client, Collection } from 'discord.js';

import type { Command } from './Command';

interface CommandError {
  name: string;
  error: Error;
  timestamp: number;
}

class GlobalStore {
  #client!: Client<boolean>;
  #commands: Collection<string, Command> = new Collection();
  #errors: Collection<string, CommandError> = new Collection();
  #prefix: string = '!';

  get client() {
    return this.#client;
  }

  set client(client: Client<boolean>) {
    this.#client = client;
  }

  get prefix() {
    return this.#prefix;
  }

  set prefix(prefix: string) {
    this.#prefix = prefix;
  }

  get commands() {
    return this.#commands;
  }

  get errors() {
    return this.#errors;
  }

  addCommand(command: Command) {
    if (this.#client.debug) console.log(`[CommandStore] Adding command ${command.name}`);
    this.#commands.set(command.name, command);
  }

  addCommandError(commandName: string, error: Error) {
    if (this.#client.debug) console.log(`[CommandStore] New error for command ${commandName}`);
    const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.#errors.set(`${commandName}_${id}`, { name: commandName, error, timestamp: Date.now() });
  }
}

export const CommandStore = new GlobalStore();
