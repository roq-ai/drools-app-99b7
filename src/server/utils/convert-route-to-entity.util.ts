const mapping: Record<string, string> = {
  audio: 'audio',
  libraries: 'library',
  ratings: 'rating',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
