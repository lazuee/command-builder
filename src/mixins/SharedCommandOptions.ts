import type { ApplicationCommandOptionBase } from './ApplicationCommandOptionBase';
import { assertReturnOfBuilder, validateMaxOptionsLength } from '../Assertions';
import { CommandAttachmentOption } from '../options/attachment';
import { CommandBooleanOption } from '../options/boolean';
import { CommandChannelOption } from '../options/channel';
import { CommandIntegerOption } from '../options/integer';
import { CommandMentionableOption } from '../options/mentionable';
import { CommandMessageOption } from '../options/message';
import { CommandNumberOption } from '../options/number';
import { CommandRoleOption } from '../options/role';
import { CommandStringOption } from '../options/string';
import { CommandUserOption } from '../options/user';

import type { ToAPIApplicationCommandOptions } from '../CommandBuilder';
export class SharedCommandOptions<ShouldOmitSubcommandFunctions = true> {
  public readonly options!: ToAPIApplicationCommandOptions[];

  public addBooleanOption(input: CommandBooleanOption | ((builder: CommandBooleanOption) => CommandBooleanOption)) {
    return this._sharedAddOptionMethod(input, CommandBooleanOption);
  }

  public addUserOption(input: CommandUserOption | ((builder: CommandUserOption) => CommandUserOption)) {
    return this._sharedAddOptionMethod(input, CommandUserOption);
  }

  public addChannelOption(input: CommandChannelOption | ((builder: CommandChannelOption) => CommandChannelOption)) {
    return this._sharedAddOptionMethod(input, CommandChannelOption);
  }

  public addRoleOption(input: CommandRoleOption | ((builder: CommandRoleOption) => CommandRoleOption)) {
    return this._sharedAddOptionMethod(input, CommandRoleOption);
  }

  public addMessageOption(input: CommandMessageOption | ((builder: CommandMessageOption) => CommandMessageOption)) {
    return this._sharedAddOptionMethod(input, CommandMessageOption);
  }

  public addAttachmentOption(input: CommandAttachmentOption | ((builder: CommandAttachmentOption) => CommandAttachmentOption)) {
    return this._sharedAddOptionMethod(input, CommandAttachmentOption);
  }

  public addMentionableOption(input: CommandMentionableOption | ((builder: CommandMentionableOption) => CommandMentionableOption)) {
    return this._sharedAddOptionMethod(input, CommandMentionableOption);
  }

  public addStringOption(
    input:
      | CommandStringOption
      | Omit<CommandStringOption, 'setAutocomplete'>
      | Omit<CommandStringOption, 'addChoices'>
      | ((builder: CommandStringOption) => CommandStringOption | Omit<CommandStringOption, 'setAutocomplete'> | Omit<CommandStringOption, 'addChoices'>)
  ) {
    return this._sharedAddOptionMethod(input, CommandStringOption);
  }

  public addIntegerOption(
    input:
      | CommandIntegerOption
      | Omit<CommandIntegerOption, 'setAutocomplete'>
      | Omit<CommandIntegerOption, 'addChoices'>
      | ((builder: CommandIntegerOption) => CommandIntegerOption | Omit<CommandIntegerOption, 'setAutocomplete'> | Omit<CommandIntegerOption, 'addChoices'>)
  ) {
    return this._sharedAddOptionMethod(input, CommandIntegerOption);
  }

  public addNumberOption(
    input:
      | CommandNumberOption
      | Omit<CommandNumberOption, 'setAutocomplete'>
      | Omit<CommandNumberOption, 'addChoices'>
      | ((builder: CommandNumberOption) => CommandNumberOption | Omit<CommandNumberOption, 'setAutocomplete'> | Omit<CommandNumberOption, 'addChoices'>)
  ) {
    return this._sharedAddOptionMethod(input, CommandNumberOption);
  }

  private _sharedAddOptionMethod<T extends ApplicationCommandOptionBase>(
    input: T | Omit<T, 'setAutocomplete'> | Omit<T, 'addChoices'> | ((builder: T) => T | Omit<T, 'setAutocomplete'> | Omit<T, 'addChoices'>),
    Instance: new () => T
  ): ShouldOmitSubcommandFunctions extends true ? Omit<this, 'addSubcommand' | 'addSubcommandGroup'> : this {
    const { options } = this;

    validateMaxOptionsLength(options);

    const result = typeof input === 'function' ? input(new Instance()) : input;

    assertReturnOfBuilder(result, Instance);

    options.push(result);

    return this;
  }
}
