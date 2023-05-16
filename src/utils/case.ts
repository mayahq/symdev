export function isSnakeCase(str: string) {
    const regex = /^[a-z0-9](_?[a-z0-9]+)*$/g;
    return regex.test(str);
}