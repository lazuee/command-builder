import axios from 'axios';
import { MessageAttachment } from 'discord.js';

import is from '@sindresorhus/is';

import { BaseOptions } from './baseOptions';

import type { CommandTriggerInteraction } from '.';
export class InteractionOptions extends BaseOptions {
  interaction: CommandTriggerInteraction;
  constructor(interaction: CommandTriggerInteraction) {
    super();
    this.interaction = interaction;
  }

  get get() {
    return this.interaction.options.get;
  }

  get getAttachment() {
    return (name: string, required: boolean = false) => {
      return getAttachment.call(this, name, required);
    };
  }

  get getMessage() {
    return (name: string, required: boolean = false) => {
      return getMessage.call(this, name, required);
    };
  }

  get getBoolean() {
    return this.interaction.options.getBoolean;
  }

  get getChannel() {
    return this.interaction.options.getChannel;
  }

  get getInteger() {
    return this.interaction.options.getInteger;
  }

  get getMember() {
    return this.interaction.options.getMember;
  }

  get getMentionable() {
    return this.interaction.options.getMentionable;
  }

  get getNumber() {
    return this.interaction.options.getNumber;
  }

  get getString() {
    return this.interaction.options.getString;
  }

  get getUser() {
    return this.interaction.options.getUser;
  }

  get getRole() {
    return this.interaction.options.getRole;
  }

  get getSubcommand() {
    return this.interaction.options.getSubcommand;
  }

  get getSubcommandGroup() {
    return this.interaction.options.getSubcommandGroup;
  }
}

function getMessage(this: InteractionOptions, name: string, required = false) {
  const string = this.getString(name, required)?.trim();

  if (is.string(string)) {
    const result = new RegExp(/^(?:https:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(?<guildId>(?:\d{17,19}|@me))\/(?<channelId>\d{17,19})\/(?<messageId>\d{17,19})$/)
      .exec(string)
      ?.slice(1);
    if (!is.nullOrUndefined(result)) {
      const [guildId, channelId, messageId] = result;
      const guild = this.interaction.client.guilds.cache.get(guildId as string);
      if (is.nullOrUndefined(guild)) return Promise.resolve(null);
      const channel = guild.channels.cache.get(channelId as string);
      if (is.nullOrUndefined(channel)) return Promise.resolve(null);
      if (channel.isText()) {
        return channel.messages.fetch(messageId as string).catch(() => null);
      }
    }
  }

  return Promise.resolve(null);
}

async function getAttachment(this: InteractionOptions, name: string, required = false) {
  const string = this.getString(name, required)?.trim();
  let attachment: MessageAttachment | null = null;

  if (is.string(string) && string.match(/^https?:\/\//)) {
    const response = await axios({
      url: new URL(string).toString(),
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      responseType: 'arraybuffer',
    });

    if (response?.data) {
      const name = response.headers['content-disposition']?.split('filename=')[1];
      const type = response.headers['content-type'];
      const buffer = Buffer.from(response.data, 'binary');

      if (buffer && type) {
        const ranname = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        attachment = new MessageAttachment(buffer, `${is.string(name) ? name : ranname}.${type.split('/')[1]}`);
      }
    }
  }

  if (is.nullOrUndefined(attachment)) attachment = this.get(name, required)?.attachment ?? null;

  return attachment ?? null;
}
