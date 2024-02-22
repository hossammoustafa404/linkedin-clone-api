import {
  Between,
  ILike,
  In,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  QueryBuilder,
  SelectQueryBuilder,
} from 'typeorm';

export class ApiFeatures {
  constructor(
    public sqlQuery: SelectQueryBuilder<any>,
    public query: any,
  ) {}

  prepareFilters() {
    // Exclude unnessary fields
    const queryCopy = { ...this.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'keyword'];
    excludedFields.forEach((field) => delete queryCopy[field]);

    if (!Object.keys(queryCopy).length) {
      return false;
    }

    let filterObject: any = {};

    // Iterate over the query props and transform them to valid typeorm filters
    Object.keys(queryCopy).forEach((prop) => {
      const value = queryCopy[prop];

      if (typeof value === 'string') {
        filterObject[prop] = ILike(`%${value}%`);
      } else {
        Object.keys(value).forEach((operator) => {
          const nestedValue = value[operator];
          switch (operator) {
            case 'gt':
              filterObject[prop] = MoreThan(nestedValue);
              break;

            case 'lt':
              filterObject[prop] = LessThan(nestedValue);

            case 'in':
              filterObject[prop] = In(nestedValue);

            case 'ne':
              filterObject[prop] = Not(nestedValue);

            case 'between':
              const minMax = nestedValue.split(',');
              filterObject[prop] = Between(minMax[0], minMax[1]);

            case 'gte':
              filterObject[prop] = MoreThanOrEqual(nestedValue);

            case 'lte':
              filterObject[prop] = LessThanOrEqual(nestedValue);

            default:
              break;
          }
        });
      }
    });

    return filterObject;
  }
  filter() {
    const filterObj = this.prepareFilters();

    if (!filterObj) {
      return this;
    }

    this.sqlQuery = this.sqlQuery.andWhere(filterObj);

    return this;
  }

  sort() {
    if (!this.query?.sort) {
      return this;
    }

    const sortFields: string[] = this.query?.sort?.split(',');
    const sqlQueryAlias = this.sqlQuery.alias;

    sortFields.forEach((field, index) => {
      if (field.startsWith('A')) {
        if (index === 0) {
          this.sqlQuery = this.sqlQuery.orderBy(
            `${sqlQueryAlias}.${field.slice(2)}`,
            'ASC',
          );
        } else {
          this.sqlQuery = this.sqlQuery.addOrderBy(
            `${sqlQueryAlias}.${field.slice(2)}`,
            'ASC',
          );
        }
      } else if (field.startsWith('D')) {
        if (index === 0) {
          this.sqlQuery = this.sqlQuery.orderBy(
            `${sqlQueryAlias}.${field.slice(2)}`,
            'DESC',
          );
        } else {
          this.sqlQuery = this.sqlQuery.addOrderBy(
            `${sqlQueryAlias}.${field.slice(2)}`,
            'DESC',
          );
        }
      }
    });

    return this;
  }

  // limitFields() {
  //   if (!this.query?.fields) {
  //     return this;
  //   }

  //   console.log(this.query);

  //   const limitedFields: string[] = this.query?.fields?.split(',');

  //   const finalLimitedFields = limitedFields.map((field) => field);
  //   console.log(finalLimitedFields);

  //   this.sqlQuery = this.sqlQuery.select('"firstName"');

  //   console.log(this.sqlQuery.getQuery());

  //   return this;
  // }

  search(fields: string[]) {
    const keyword = this.query?.keyword;
    if (!keyword) {
      return this;
    }

    const searchArr = fields.map((field) => ({
      [field]: ILike(`%${keyword}%`),
    }));

    this.sqlQuery = this.sqlQuery.andWhere(searchArr);
    return this;
  }

  paginate() {
    const page = +this.query?.page || 1;
    const limit = +this.query?.limit || 10;
    const skip = (page - 1) * limit;

    this.sqlQuery = this.sqlQuery.skip(skip).take(limit);

    return this;
  }
}
