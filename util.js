export function isNameUnique(name, parent, presentItem) {
    return parent.children.every(item => item.name !== name || item === presentItem);
}