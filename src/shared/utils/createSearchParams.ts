export const createSearchParams = (query: any, searchFields?: string[]) => {
  let searchParams: any = {};

  // Get search
  if (query.search) {
    searchParams.q = query.search;
    searchParams.query_by = searchFields.join(',');
    delete query.search;
  } else {
    searchParams.q = '*';
  }

  // Get sort
  if (query.sort) {
    delete query.sort;
    // const sortArr: string[] = query.sort.split(',');
    // const formattedSortArr = sortArr.map((field) => {
    //   if (field.startsWith('+')) {
    //     return `${field}:asc`;
    //   } else if (field.startsWith('-')) {
    //     return `${field}:desc`;
    //   }
    // });
    // const finalSort = formattedSortArr.join(',');
    // searchParams.sort_by = finalSort;
  }

  // Get filter
  const formattedfilterArr = Object.keys(query).map((field) => {
    const value = query[field];
    if (typeof value === 'string') {
      return `${field}:=${value}`;
    } else {
      const operators = Object.keys(value);

      for (let i = 0; i < operators.length; i++) {
        const nestedValue = value[operators[i]];
        switch (operators[i]) {
          case 'in':
            const inArr = nestedValue.split(',');
            return `${field}:[${inArr}]`;
          case 'ne':
            return `${field}:!=${nestedValue}`;
          case 'between':
            const minMax = nestedValue.split(',');
            return `${field}:[${minMax[0]}..${minMax[1]}]`;
          case 'gte':
            return `${field}:>=${nestedValue}`;

          case 'gt':
            return `${field}:>${nestedValue}`;

          case 'lte':
            return `${field}:<=${nestedValue}`;

          case 'lt':
            return `${field}:<${nestedValue}`;

          default:
            break;
        }
      }
    }
    delete query.field;
  });

  const finalFilterString = formattedfilterArr.join('&&');
  searchParams.filter_by = finalFilterString;

  return searchParams;
};
