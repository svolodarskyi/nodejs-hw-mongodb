const parseBoolean = (value) => {
  if (typeof value === 'boolean') return value;

  if (typeof value === 'string') {
    const lowered = value.toLowerCase().trim();
    if (lowered === 'true' || lowered === '1') return true;
    if (lowered === 'false' || lowered === '0') return false;
  }

  if (typeof value === 'number') {
    return value === 1;
  }

  return undefined;
};

export const parseFilterParams = (query) => {
  const { isFavourite } = query;

  const parsedIsFavourite = parseBoolean(isFavourite);

  return {
    isFavourite: parsedIsFavourite,
  };
};
