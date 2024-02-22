import { LessThan, MoreThan } from 'typeorm';

export const createFilterObject = (query: any) => {
  // Prepare query by deleting props that is not related to filtering process
  const exculdedProps = ['page', 'limit', 'sort', 'fields'];
  exculdedProps.forEach((prop) => delete query[prop]);

  let filterObject: any = {};

  // Iterate over the query props and transform them to valid typeorm conditions
  Object.keys(query).forEach((prop) => {
    const value = query[prop];

    if (typeof value === 'string') {
      filterObject[prop] = value;
    } else {
      Object.keys(value).forEach((operator) => {
        const nestedValue = value[operator];
        switch (operator) {
          case 'gt':
            filterObject[prop] = MoreThan(nestedValue);
            break;

          case 'lt':
            filterObject[prop] = LessThan(nestedValue);
          default:
            break;
        }
      });
    }
  });

  return filterObject;
};
