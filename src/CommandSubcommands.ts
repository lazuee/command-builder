import {
    APIApplicationCommandSubcommandGroupOption, APIApplicationCommandSubcommandOption,
    ApplicationCommandOptionType
} from 'discord-api-types/v10';
import { mix } from 'ts-mixer';

import {
    assertReturnOfBuilder, validateMaxOptionsLength, validateRequiredParameters
} from './Assertions';
import {
    CommandSubcommandGroupOption, CommandSubcommandOption, CommandType
} from './CommandInterface';
import { SharedNameAndDescription } from './mixins/NameAndDescription';
import { SharedCommandOptions } from './mixins/SharedCommandOptions';

import type { ToAPIApplicationCommandOptions } from './CommandBuilder';
import type { ApplicationCommandOptionBase } from './mixins/ApplicationCommandOptionBase';
/**
 * Represents a folder for subcommands
 *
 * For more information, go to https:
 */
@mix(SharedNameAndDescription)
export class CommandSubcommandGroupBuilder implements ToAPIApplicationCommandOptions {
  /**
   * The name of this subcommand group
   */
  public readonly name: string = undefined!;

  /**
   * The description of this subcommand group
   */
  public readonly description: string = undefined!;

  /**
   * The subcommands part of this subcommand group
   */
  public readonly options: CommandSubcommandBuilder[] = [];

  /**
   * Adds a new subcommand to this group
   *
   * @param input A function that returns a subcommand builder, or an already built builder
   */
  public addSubcommand(input: CommandSubcommandBuilder | ((subcommandGroup: CommandSubcommandBuilder) => CommandSubcommandBuilder)) {
    const { options } = this;

    validateMaxOptionsLength(options);

    const result = typeof input === 'function' ? input(new CommandSubcommandBuilder()) : input;

    assertReturnOfBuilder(result, CommandSubcommandBuilder);

    options.push(result);

    return this;
  }

  public toSlash(): APIApplicationCommandSubcommandGroupOption {
    validateRequiredParameters(this.name, this.description, this.options);

    return {
      type: ApplicationCommandOptionType.SubcommandGroup,
      name: this.name,
      name_localizations: this.name_localizations,
      description: this.description,
      description_localizations: this.description_localizations,
      options: this.options.map(option => option.toSlash()),
    };
  }

  public toCommand(): CommandSubcommandGroupOption {
    return {
      name: this.name,
      description: this.description,
      type: CommandType.SubcommandGroup,
      options: this.options.map(option => option.toCommand()),
    };
  }
}

export interface CommandSubcommandGroupBuilder extends SharedNameAndDescription {}

/**
 * Represents a subcommand
 *
 * For more information, go to https:
 */
@mix(SharedNameAndDescription, SharedCommandOptions)
export class CommandSubcommandBuilder implements ToAPIApplicationCommandOptions {
  /**
   * The name of this subcommand
   */
  public readonly name: string = undefined!;

  /**
   * The description of this subcommand
   */
  public readonly description: string = undefined!;

  /**
   * The options of this subcommand
   */
  public readonly options: ApplicationCommandOptionBase[] = [];

  public toSlash(): APIApplicationCommandSubcommandOption {
    validateRequiredParameters(this.name, this.description, this.options);

    return {
      type: ApplicationCommandOptionType.Subcommand,
      name: this.name,
      name_localizations: this.name_localizations,
      description: this.description,
      description_localizations: this.description_localizations,
      options: this.options.map(option => option.toSlash()),
    };
  }

  public toCommand(): CommandSubcommandOption {
    return {
      name: this.name,
      description: this.description,
      type: CommandType.Subcommand,
      options: this.options.map(option => option.toCommand()),
    };
  }
}

export interface CommandSubcommandBuilder extends SharedNameAndDescription, SharedCommandOptions<false> {}
