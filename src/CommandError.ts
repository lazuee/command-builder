import is from '@sindresorhus/is';

export class CommandError extends Error {
  code: string;

  constructor(public key, message) {
    if (is.error(key)) {
      message = key.message;
      //@ts-ignore
      key = key.code;
    }
    if (is.nullOrUndefined(message)) {
      message = key;
      key = 'UNKNOWN';
    }

    super(message as string);
    this.code = key;
  }

  override get name() {
    return `LazueeCommand#${this.code}`;
  }
}
