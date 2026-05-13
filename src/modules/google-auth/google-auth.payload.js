/**
 * Public user shape for auth responses.
 * @param {import("../users/users.model.js").User} user
 */
export function buildUserPayload(user) {
  return {
    id: user.id,
    name: user.full_name ?? "",
    email: user.email,
    picture: user.picture_url ?? "",
    is_active: user.is_active ? 1 : 0,
  };
}
