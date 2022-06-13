import {
    Client, CommandInteraction, DMChannel, Guild, GuildMember, InteractionReplyOptions,
    InteractionUpdateOptions, Message, MessageAttachment, MessageEditOptions, MessageEmbed,
    MessageOptions, PartialDMChannel, ReplyMessageOptions, User
} from 'discord.js';

import {
    canReadMessages, canSendAttachments, canSendEmbeds, canSendMessages, GuildTextBasedChannelTypes,
    isDMChannel, isGuildBasedChannel, isGuildMember, isTextBasedChannel, runsOnInteraction,
    safelyReplyToInteraction
} from '@sapphire/discord.js-utilities';
import is from '@sindresorhus/is';

import { Command, CommandStore } from '../';
import { CommandError } from '../CommandError';
import { CommandTriggerInteraction, CommandTriggerMessage } from './';

function ReplyOptions(
  this: CommandTriggerBase,
  options: string | MessageEditOptions | InteractionUpdateOptions | MessageOptions | ReplyMessageOptions | InteractionReplyOptions = {}
) {
  if (is.string(options)) options = { content: options };

  let msg_options = {} as ReplyMessageOptions;
  let int_options = {} as InteractionReplyOptions;
  let edit_options = {} as MessageEditOptions;

  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.attachments)) edit_options.attachments = options.attachments;
  //@ts-ignore
  if (!is.string(edit_options.content)) edit_options.content = options.content;
  //@ts-ignore
  if (is.array(edit_options.embeds) && options.embeds?.every(file => file instanceof MessageEmbed))
    //@ts-ignore
    edit_options.embeds = options.embeds;
  //@ts-ignore
  if (is.array(edit_options.files) && options.files?.every(file => file instanceof MessageAttachment)) edit_options.files = options.files;
  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.flags)) edit_options.flags = options.flags;
  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.allowedMentions)) edit_options.allowedMentions = options.allowedMentions;
  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.components)) edit_options.components = options.components;

  msg_options = edit_options as ReplyMessageOptions;
  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.components)) msg_options.failIfNotExists = options.failIfNotExists;

  int_options = edit_options as InteractionReplyOptions;
  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.ephemeral)) int_options.ephemeral = options.ephemeral;
  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.fetchReply)) int_options.fetchReply = options.fetchReply;
  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.flags)) int_options.flags = options.flags;
  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.username)) int_options.username = options.username;
  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.avatarURL)) int_options.avatarURL = options.avatarURL;
  //@ts-ignore
  if (!is.nullOrUndefined(edit_options.threadId)) int_options.threadId = options.threadId;

  return { message: msg_options, interaction: int_options, edit: edit_options };
}

export type MessageOrInteraction = Message<boolean> | CommandInteraction<'cached'>;
export class CommandTriggerBase {
  isInteraction(): this is CommandTriggerInteraction {
    return this instanceof CommandTriggerInteraction;
  }
  isMessage(): this is CommandTriggerMessage {
    return this instanceof CommandTriggerMessage;
  }

  client: Client<boolean>;
  command: Command;
  data: MessageOrInteraction;

  #author: User | null;
  #member: GuildMember | null;
  #guild: Guild | null;
  #channel: DMChannel | PartialDMChannel | GuildTextBasedChannelTypes | null;

  constructor(command: Command, data: MessageOrInteraction) {
    this.client = CommandStore.client ?? data.client;
    this.command = command;
    this.data = data;

    if (this.isMessage()) {
      this.#author = this.data.author;
      this.#member = this.data.member;
      this.#guild = this.data.guild;
      this.#channel = this.data.channel;
    } else if (this.isInteraction()) {
      this.#author = this.data.user;
      this.#member = this.data.member;
      this.#guild = this.data.guild;
      this.#channel = this.data.channel;
    } else {
      this.#author = null;
      this.#member = null;
      this.#guild = null;
      this.#channel = null;
    }
  }

  get author(): User | null {
    if (!is.nullOrUndefined(this.#author)) return this.#author;

    return null;
  }

  set author(author: User | null) {
    if (author instanceof User) {
      if (runsOnInteraction(this.data)) (this.data as any).user = author;
      else (this.data as any).author = author;

      this.#author = author;
    }
  }

  get member(): GuildMember | null {
    if (!is.nullOrUndefined(this.#member)) return this.#member;
    return null;
  }

  set member(member: GuildMember | null) {
    if (isGuildMember(this.#member)) {
      (this.data as any).member = member;

      this.#member = member;
    }
  }

  get guild(): Guild | null {
    if (!is.nullOrUndefined(this.#guild)) return this.#guild;
    return null;
  }

  set guild(guild: Guild | null) {
    if (guild instanceof Guild) {
      (this.data as any).guild = guild;

      this.#guild = guild;
    }
  }

  get channel(): DMChannel | PartialDMChannel | GuildTextBasedChannelTypes | null {
    if (!is.nullOrUndefined(this.#channel)) return this.#channel;

    return null;
  }

  set channel(channel: DMChannel | PartialDMChannel | GuildTextBasedChannelTypes | null) {
    if (isDMChannel(channel)) (this.data as any).channel = channel;
    else if (isGuildBasedChannel(channel)) (this.data as any).channel = channel;

    if (isDMChannel(channel)) this.#author = channel.recipient;

    if (isGuildBasedChannel(channel) && isTextBasedChannel(channel)) {
      const authorId = channel.lastMessage?.author?.id;
      if (authorId) {
        this.#author = this.client.users.cache.get(authorId) ?? null;
        this.#member = this.#guild?.members.cache.get(authorId) ?? null;
      }
      this.#guild = channel.guild;
    }

    this.#channel = channel;
  }

  get authorId(): string | null {
    return this.#author?.id ?? null;
  }

  get channelId(): string | null {
    return this.#channel?.id ?? null;
  }

  get guildId(): string | null {
    return this.#guild?.id ?? null;
  }

  async reply(options: string | MessageOptions | ReplyMessageOptions | InteractionReplyOptions) {
    if (is.nullOrUndefined(options)) return Promise.reject(new CommandError('REPLY_MISSING_OPTIONS', 'Missing options'));
    //@ts-ignore
    const replyOptions = ReplyOptions.bind(this)(options);
    if (this.isInteraction()) options = replyOptions.interaction;
    else if (this.isMessage()) options = replyOptions.message;

    if (!canReadMessages(this.#channel)) {
      return Promise.reject(new CommandError('REPLY_NO_PERMISSION', 'I do not have permission to read messages in this channel'));
    }
    if (!canSendMessages(this.#channel)) {
      return Promise.reject(new CommandError('REPLY_NO_PERMISSION', 'I do not have permission to send messages in this channel'));
    }
    //@ts-ignore
    if (!canSendEmbeds(this.#channel) && is.array(options.embeds) && options.embeds.length > 0) {
      return Promise.reject(new CommandError('REPLY_NO_PERMISSION', 'I do not have permission to send embeds in this channel'));
    }
    //@ts-ignore
    if (!canSendAttachments(this.#channel) && is.array(options.files) && options.files.length > 0) {
      return Promise.reject(new CommandError('REPLY_NO_PERMISSION', 'I do not have permission to send files in this channel'));
    }

    try {
      if (!is.string(replyOptions.edit?.content)) return Promise.reject(new CommandError('REPLY_MISSING_CONTENT', 'Missing content'));
      if (is.string(replyOptions.edit?.content) && replyOptions.edit?.content.length > 2000) {
        return Promise.reject(new CommandError('REPLY_TOO_LONG', 'Message is too long'));
      }
      if (this.isInteraction()) {
        const replied = await safelyReplyToInteraction({
          messageOrInteraction: this.data,
          interactionEditReplyContent: replyOptions.interaction,
          interactionReplyContent: { ...replyOptions.interaction, fetchReply: true },
          componentUpdateContent: { ...replyOptions.edit, fetchReply: true },
          messageMethod: 'reply',
          messageMethodContent: replyOptions.message,
        }).then(() => true);
        if (replied) return Promise.resolve(replied);
      } else if (this.isMessage()) {
        const replied = await this.data.reply(replyOptions.message);
        if (replied) return Promise.resolve(replied);
      }

      return Promise.reject(new CommandError('REPLY_FAILED', 'Failed to reply to message'));
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
