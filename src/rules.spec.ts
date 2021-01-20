import { IRule } from 'graphql-shield';
import { ForbiddenError } from 'apollo-server-express';
import * as rules from './rules';

/** Helper: Invoke rule with the given context. */
async function invokeWithContext(
  rule: IRule,
  ctx: Record<string, unknown>,
): Promise<boolean | string | Error> {
  // See upstream rule tests for this invocation pattern:
  // https://github.com/maticzav/graphql-shield/blob/v7.5.0/tests/logic.test.ts#L445-L460

  // graphql-shield requires this cache as part of the rule context,
  // or it will crash.
  const shieldCtx = { _shield: { cache: {} }, ...ctx };

  // Pass the debug flag to raise unexpected exceptions rather than hiding them.
  // (Hiding exceptions normally makes sense for security reasons,
  // but we want the tests to catch all unexpected exceptions.)
  const options = { debug: true };

  return await rule.resolve({}, {}, shieldCtx, {} as never, options as never);
}

/** Helper: Invoke rule with the given request user scope. */
async function invokeWithUserScope(
  rule: IRule,
  scope: string,
): Promise<boolean | string | Error> {
  const ctx = { req: { user: { scope: scope } } };
  return await invokeWithContext(rule, ctx);
}

describe.each([
  // name, rule, target scope token
  ['isRecruiter', rules.isRecruiter, 'recruiter'],
  ['isAdmin', rules.isAdmin, 'registree'],
  ['isStudent', rules.isStudent, 'student'],
])('%s', (name: string, rule: IRule, targetScope: string) => {
  // Generate some example scopes.
  // TODO(Pi): Migrate this to jsverify?
  const unauthorisedScopes: Array<string> = [
    '',
    ' ',
    'spam',
    'null',
    'undefined',
    targetScope + targetScope,
    targetScope + 'spam',
    'spam' + targetScope,
    targetScope.toUpperCase(),
    targetScope + '\tbad',
    ['recruiter', 'registree', 'student']
      .filter(s => s !== targetScope)
      .join(' '),
  ];
  const authorisedScopes: Array<string> = [
    targetScope,
    ...unauthorisedScopes
      .filter(s => 0 < s.length)
      .flatMap(spam => [
        [targetScope, spam].join(' '),
        [spam, targetScope].join(' '),
        [spam, targetScope, spam].join(' '),
      ]),
  ];

  test.each(unauthorisedScopes)(
    'unauthorised scope string: %p',
    async scope => {
      const result = await invokeWithUserScope(rule, scope);
      expect(result).toStrictEqual(new ForbiddenError('invalid scope'));
    },
  );

  test.each(authorisedScopes)('authorised scope string: %p', async scope => {
    const result = await invokeWithUserScope(rule, scope);
    expect(result).toBe(true);
  });
});
