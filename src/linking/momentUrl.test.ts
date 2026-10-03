/**
 * Lightweight URL parser smoke checks — run with:
 *   npx tsx src/linking/momentUrl.test.ts
 * (optional during foundation; typecheck covers compile)
 */
import { isOurMomentUrl, parseMomentPublicToken } from './momentUrl';

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

const token = 'AbCdEfGhIjKlMnOpQrStUvWx';

assert(
  parseMomentPublicToken(`https://ourmoment.app/m/${token}`) === token,
  'https path',
);
assert(
  parseMomentPublicToken(`ourmoment://m/${token}`) === token,
  'custom scheme',
);
assert(parseMomentPublicToken('https://evil.example/m/nope') === null, 'reject short');
assert(isOurMomentUrl(`https://www.ourmoment.app/m/${token}`), 'www host');

console.log('momentUrl checks passed');
