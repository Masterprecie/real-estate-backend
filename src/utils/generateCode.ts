export const generateCode = (): { code: string; expiresAt: Date } => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
  return { code, expiresAt };
};
