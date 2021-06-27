// A mock function to mimic making an async request for data
export function createShortUrl(originalUrl: string, userId: string = 'tstuserid') {
  return new Promise<{ data: string }>((resolve) =>
    setTimeout(() => resolve({ data: originalUrl.substr(0,8) }), 500)
  );
}
