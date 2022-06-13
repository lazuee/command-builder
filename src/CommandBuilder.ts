import type { APIApplicationCommandOption, LocalizationMap, Permissions, RESTPostAPIApplicationCommandsJSONBody } from 'discord-api-types/v10';
import { Permissions as Perms, PermissionString } from 'discord.js';
import { mix } from 'ts-mixer';

import {
    assertReturnOfBuilder, validateDefaultMemberPermissions, validateDefaultPermission,
    validateDMPermission, validateLocalizationMap, validateMaxOptionsLength,
    validateRequiredParameters
} from './Assertions';
import { CommandSubcommandBuilder, CommandSubcommandGroupBuilder } from './CommandSubcommands';
import { SharedNameAndDescription } from './mixins/NameAndDescription';
import { SharedCommandOptions } from './mixins/SharedCommandOptions';

import type { CommandJSONBody, CommandOption } from './CommandInterface';

@mix(SharedCommandOptions, SharedNameAndDescription)
export class CommandBuilder {
  public readonly name: string = undefined!;

  public readonly name_localizations?: LocalizationMap;

  public readonly description: string = undefined!;

  public readonly description_localizations?: LocalizationMap;

  public readonly options: ToAPIApplicationCommandOptions[] = [];

  public readonly default_permission: boolean | undefined = undefined;

  public readonly default_member_permissions: Permissions | null | undefined = undefined;

  public readonly default_bot_permissions: Permissions | null | undefined = undefined;

  public readonly dm_permission: boolean | undefined = undefined;

  public toSlash(): RESTPostAPIApplicationCommandsJSONBody {
    validateRequiredParameters(this.name, this.description, this.options);

    validateLocalizationMap(this.name_localizations);
    validateLocalizationMap(this.description_localizations);

    return Object.assign(
      {},
      {
        name: this.name,
        name_localizations: this.name_localizations,
        description: this.description,
        description_localizations: this.description_localizations,
        default_permission: this.default_permission,
        default_member_permissions: this.default_member_permissions,
        dm_permission: this.dm_permission,
        options: this.options.map(option => option.toSlash()),
      }
    );
  }

  public toCommand(): CommandJSONBody {
    let data = {
      name: this.name,
      description: this.description,
      permissions: {
        member: this.default_member_permissions ? new Perms(BigInt(this.default_member_permissions)).toArray() : [],
        bot: this.default_bot_permissions ? new Perms(BigInt(this.default_bot_permissions)).toArray() : [],
      },
      options: this.options.map(option => option.toCommand()),
    };

    return data;
  }

  public setDefaultPermission(value: boolean) {
    validateDefaultPermission(value);

    Reflect.set(this, 'default_permission', value);

    return this;
  }

  public setBotPermissions(...permissions: PermissionString[]) {
    permissions = [...new Set(permissions)];
    const permissionValue = validateDefaultMemberPermissions(new Perms(permissions).valueOf());

    Reflect.set(this, 'default_bot_permissions', permissionValue);

    return this;
  }

  public setMemberPermissions(...permissions: PermissionString[]) {
    permissions = [...new Set(permissions)];
    const permissionValue = validateDefaultMemberPermissions(new Perms(permissions).valueOf());

    Reflect.set(this, 'default_member_permissions', permissionValue);

    return this;
  }

  public setDMPermission(enabled: boolean | null | undefined) {
    validateDMPermission(enabled);

    Reflect.set(this, 'dm_permission', enabled);

    return this;
  }

  public addSubcommandGroup(
    input: CommandSubcommandGroupBuilder | ((subcommandGroup: CommandSubcommandGroupBuilder) => CommandSubcommandGroupBuilder)
  ): CommandSubcommandsOnlyBuilder {
    const { options } = this;

    validateMaxOptionsLength(options);

    const result = typeof input === 'function' ? input(new CommandSubcommandGroupBuilder()) : input;

    assertReturnOfBuilder(result, CommandSubcommandGroupBuilder);

    options.push(result);

    return this;
  }

  public addSubcommand(input: CommandSubcommandBuilder | ((subcommandGroup: CommandSubcommandBuilder) => CommandSubcommandBuilder)): CommandSubcommandsOnlyBuilder {
    const { options } = this;

    validateMaxOptionsLength(options);

    const result = typeof input === 'function' ? input(new CommandSubcommandBuilder()) : input;

    assertReturnOfBuilder(result, CommandSubcommandBuilder);

    options.push(result);

    return this;
  }
}

export interface CommandBuilder extends SharedNameAndDescription, SharedCommandOptions {}

export interface CommandSubcommandsOnlyBuilder extends SharedNameAndDescription, Pick<CommandBuilder, 'toSlash' | 'toCommand' | 'addSubcommand' | 'addSubcommandGroup'> {}

export interface CommandOptionsOnlyBuilder extends SharedNameAndDescription, SharedCommandOptions, Pick<CommandBuilder, 'toSlash' | 'toCommand'> {}

export interface ToAPIApplicationCommandOptions {
  toSlash: () => APIApplicationCommandOption;
  toCommand: () => CommandOption;
}
