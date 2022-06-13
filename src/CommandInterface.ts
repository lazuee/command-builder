import type { PermissionString } from 'discord.js';
import type { ApplicationCommandOptionAllowedChannelTypes } from './mixins/ApplicationCommandOptionChannelTypesMixin';

export enum CommandType {
  Subcommand = 'subcommand',
  SubcommandGroup = 'subcommandgroup',
  String = 'string',
  Number = 'number',
  Boolean = 'boolean',
  User = 'user',
  Channel = 'channel',
  Role = 'role',
  Message = 'message',
  Attachment = 'attachment',
  Mentionable = 'mentionable',
  Integer = 'integer',
}

export interface CommandBaseOption<T extends CommandType> {
  name: string;
  description: string;
  type: T;
  required?: boolean;
}

export interface CommandStringOption extends CommandBaseOption<CommandType.String> {}
export interface CommandNumberOption extends CommandBaseOption<CommandType.Number> {
  min: number | null;
  max: number | null;
}
export interface CommandBooleanOption extends CommandBaseOption<CommandType.Boolean> {}
export interface CommandUserOption extends CommandBaseOption<CommandType.User> {}
export interface CommandChannelOption extends CommandBaseOption<CommandType.Channel> {
  channelTypes: ApplicationCommandOptionAllowedChannelTypes[];
}
export interface CommandRoleOption extends CommandBaseOption<CommandType.Role> {}
export interface CommandMessageOption extends CommandBaseOption<CommandType.Message> {}
export interface CommandAttachmentOption extends CommandBaseOption<CommandType.Attachment> {}
export interface CommandMentionableOption extends CommandBaseOption<CommandType.Mentionable> {}
export interface CommandIntegerOption extends CommandBaseOption<CommandType.Integer> {
  min: number | null;
  max: number | null;
}

export type CommandBasicOption =
  | CommandStringOption
  | CommandNumberOption
  | CommandBooleanOption
  | CommandUserOption
  | CommandChannelOption
  | CommandRoleOption
  | CommandMessageOption
  | CommandAttachmentOption
  | CommandMentionableOption
  | CommandIntegerOption;

export interface CommandSubcommandOption extends CommandBaseOption<CommandType.Subcommand> {
  name: string;
  description: string;
  type: CommandType.Subcommand;
  options: CommandBasicOption[];
}

export interface CommandSubcommandGroupOption {
  name: string;
  description: string;
  type: CommandType.SubcommandGroup;
  options: CommandSubcommandOption[];
}

export type CommandOption = CommandBasicOption | CommandSubcommandOption | CommandSubcommandGroupOption;

export interface CommandJSONBody {
  name: string;
  description: string;
  permissions: {
    member: PermissionString[];
    bot: PermissionString[];
  };
  options: CommandOption[];
}
