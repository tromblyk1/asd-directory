declare module 'papaparse' {
  export type ParseResult<T = unknown> = {
    data: T[];
    errors: Array<{
      type: string;
      code: string;
      message: string;
      row: number;
    }>;
    meta: Record<string, unknown>;
  };

  export type ParseConfig<T = unknown> = {
    header?: boolean;
    skipEmptyLines?: boolean;
    complete?: (results: ParseResult<T>) => void;
  };

  const Papa: {
    parse<T = unknown>(input: string, config?: ParseConfig<T>): ParseResult<T>;
  };

  export default Papa;
}

