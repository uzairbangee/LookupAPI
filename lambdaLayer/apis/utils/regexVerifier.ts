export function inspectId(id: string): Boolean {
  if (!!id && /^[A-Za-z0-9_-]*$/.test(id)) {
    return true;
  }

  return false;
}

export function inspectString(text: string): Boolean {
  const newText = text.replace(/\s\s+/g, " ").trim();

  if (!!newText && newText !== " ") {
    return true;
  }

  return false;
}
