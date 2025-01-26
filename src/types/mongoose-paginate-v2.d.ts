declare module "mongoose-paginate-v2" {
  import { Document, Model, PaginateOptions, PaginateResult } from "mongoose";

  interface PaginateModel<T extends Document> extends Model<T> {
    paginate(
      query?: object,
      options?: PaginateOptions,
      callback?: (err: any, result: PaginateResult<T>) => void
    ): Promise<PaginateResult<T>>;
  }

  function plugin(schema: any): void;

  export = plugin;
}
