export function hasInterrupt(result: any) {
  return result && result.__interrupt__ && Array.isArray(result.__interrupt__);
}
