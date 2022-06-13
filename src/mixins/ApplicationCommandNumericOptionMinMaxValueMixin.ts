export abstract class ApplicationCommandNumericOptionMinMaxValueMixin {
  public readonly max_value?: number;
  public readonly min_value?: number;

  public abstract setMaxValue(max: number): this;

  public abstract setMinValue(min: number): this;
}
