import { SQL, and, eq, gt, gte, inArray, like, lt, lte, ne, or } from 'drizzle-orm';

export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'in';

export class QueryBuilder {
  private conditions: (SQL<unknown> | undefined)[] = [];

  where(field: any, operator: FilterOperator, value: unknown): this {
    if (value === undefined || value === null) {
      return this;
    }

    switch (operator) {
      case 'eq':
        this.conditions.push(eq(field, value));
        break;
      case 'ne':
        this.conditions.push(ne(field, value));
        break;
      case 'gt':
        this.conditions.push(gt(field, value));
        break;
      case 'gte':
        this.conditions.push(gte(field, value));
        break;
      case 'lt':
        this.conditions.push(lt(field, value));
        break;
      case 'lte':
        this.conditions.push(lte(field, value));
        break;
      case 'like':
        this.conditions.push(like(field, `%${String(value)}%`));
        break;
      case 'in':
        if (Array.isArray(value) && value.length) {
          this.conditions.push(inArray(field, value));
        }
        break;
      default:
        break;
    }

    return this;
  }

  whereRaw(condition?: SQL): this {
    if (condition) {
      this.conditions.push(condition);
    }
    return this;
  }

  anyOf(conditions: (SQL<unknown> | undefined)[]): this {
    const validConditions = conditions.filter((c): c is SQL<unknown> => c !== undefined);
    if (validConditions.length) {
      this.conditions.push(or(...validConditions));
    }
    return this;
  }

  build(): SQL<unknown> | undefined {
    const validConditions = this.conditions.filter((c): c is SQL<unknown> => c !== undefined);
    return validConditions.length ? and(...validConditions) : undefined;
  }
}
