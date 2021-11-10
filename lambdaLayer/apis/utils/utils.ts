export function cleanObject(obj: any) {
  for (var propName in obj) {
    if (obj[propName] === "" || obj[propName] === null) {
      delete obj[propName];
    }
  }
  return obj;
}
