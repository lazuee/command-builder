import type { LocaleString, LocalizationMap } from 'discord-api-types/v10';
import { validateDescription, validateLocale, validateName } from '../Assertions';

export class SharedNameAndDescription {
  public readonly name!: string;
  public readonly name_localizations?: LocalizationMap;
  public readonly description!: string;
  public readonly description_localizations?: LocalizationMap;

  public setName(name: string): this {
    // Assert the name matches the conditions
    validateName(name);

    Reflect.set(this, 'name', name);

    return this;
  }

  public setDescription(description: string) {
    // Assert the description matches the conditions
    validateDescription(description);

    Reflect.set(this, 'description', description);

    return this;
  }

  public setNameLocalization(locale: LocaleString, localizedName: string | null) {
    if (!this.name_localizations) {
      Reflect.set(this, 'name_localizations', {});
    }

    const parsedLocale = validateLocale(locale);

    if (localizedName === null) {
      this.name_localizations![parsedLocale] = null;
      return this;
    }

    validateName(localizedName);

    this.name_localizations![parsedLocale] = localizedName;
    return this;
  }

  public setNameLocalizations(localizedNames: LocalizationMap | null) {
    if (localizedNames === null) {
      Reflect.set(this, 'name_localizations', null);
      return this;
    }

    Reflect.set(this, 'name_localizations', {});

    Object.entries(localizedNames).forEach(args => this.setNameLocalization(...(args as [LocaleString, string | null])));
    return this;
  }

  public setDescriptionLocalization(locale: LocaleString, localizedDescription: string | null) {
    if (!this.description_localizations) {
      Reflect.set(this, 'description_localizations', {});
    }

    const parsedLocale = validateLocale(locale);

    if (localizedDescription === null) {
      this.description_localizations![parsedLocale] = null;
      return this;
    }

    validateDescription(localizedDescription);

    this.description_localizations![parsedLocale] = localizedDescription;
    return this;
  }

  public setDescriptionLocalizations(localizedDescriptions: LocalizationMap | null) {
    if (localizedDescriptions === null) {
      Reflect.set(this, 'description_localizations', null);
      return this;
    }

    Reflect.set(this, 'description_localizations', {});
    Object.entries(localizedDescriptions).forEach(args => this.setDescriptionLocalization(...(args as [LocaleString, string | null])));
    return this;
  }
}
