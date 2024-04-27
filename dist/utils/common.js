export const convertObjectToArray = (args) => {
    const { data, extract } = args;
    if (extract === 'keys')
        return Object.keys(data);
    if (extract === 'values')
        return Object.values(data);
    if (extract === 'entries')
        return Object.entries(data);
    return Object.keys(data);
};
