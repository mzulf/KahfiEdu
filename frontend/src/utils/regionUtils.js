export function getIdByName(list, name) {
    const item = list.find((i) => i.name === name);
    return item?.id || null;
}