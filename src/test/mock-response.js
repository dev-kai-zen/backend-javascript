/**
 * Minimal Express `res` mock for controller unit tests.
 * @returns {{ statusCode: number, body: unknown, status: (code: number) => unknown, json: (payload: unknown) => unknown }}
 */
export function createMockResponse() {
  const res = {
    statusCode: 200,
    body: undefined,
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(payload) {
      res.body = payload;
      return res;
    },
  };
  return res;
}
