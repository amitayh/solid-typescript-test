export enum Operator {
  Equals = "eq",
  NotEquals = "neq",
  GreaterThan = "gt",
  GreaterThanEquals = "gte",
  LessThan = "lt",
  LessThanEquals = "lte",
  Between = "bet",
  NotBetween = "nbet",
  Contains = "con",
  DoesNotContain = "ncon",
  In = "in",
  NotIn = "nin",
}

export type StringValue = {
  operator:
    | Operator.Equals
    | Operator.NotEquals
    | Operator.Contains
    | Operator.DoesNotContain;
  value: string;
};

export type BooleanValue = { value: boolean };

export type SingleComparableValue<T> = {
  operator:
    | Operator.Equals
    | Operator.NotEquals
    | Operator.GreaterThan
    | Operator.GreaterThanEquals
    | Operator.LessThan
    | Operator.LessThanEquals;
  value: T;
};

export type RangeValue<T> = {
  operator: Operator.Between | Operator.NotBetween;
  range: [T, T];
};

export type ListValue<T> = {
  operator: Operator.In | Operator.NotIn;
  values: T[];
};

export type ComparableValue<T> = SingleComparableValue<T> | RangeValue<T>;

export type NumberValue = ComparableValue<number>;

export type DateValue = ComparableValue<Date>;

export type StringListValue = ListValue<string>;

export type Field =
  | ({ field: "name" } & StringValue)
  | ({ field: "age" } & NumberValue)
  | ({ field: "dob" } & DateValue)
  | ({ field: "country" } & StringListValue)
  | ({ field: "married" } & BooleanValue);

export type FilterGroup = { operator: "and" | "or"; filters: Filter[] };

export type Filter = FilterGroup | Field;

export const filter: Filter = {
  operator: "and",
  filters: [
    {
      field: "name",
      operator: Operator.Contains,
      value: "John",
    },
    {
      operator: "or",
      filters: [
        {
          field: "age",
          operator: Operator.Between,
          range: [25, 30],
        },
        {
          field: "dob",
          operator: Operator.GreaterThan, // after
          value: new Date("1986-07-09"),
        },
      ],
    },
    {
      field: "country",
      operator: Operator.In, // is
      values: ["IL"], // Israel
    },
    {
      field: "married",
      value: true,
    },
  ],
};
