import { PluginDefinition } from 'apollo-server-core';
import { GraphQLNonNull } from 'graphql';

const getNestedError = (source: unknown, depth = 0): Error | null => {
  if (depth > 10) {
    return null;
  }
  if (source instanceof Error) {
    return source;
  } else if (source instanceof Array) {
    return (
      source
        .map(x => getNestedError(x, depth + 1))
        .find(x => x instanceof Error) || null
    );
  } else if (source instanceof Object) {
    return (
      Object.values(source)
        .map(x => getNestedError(x, depth + 1))
        .find(x => x instanceof Error) || null
    );
  } else {
    return null;
  }
};

export const throwNestedErrorPlugin: PluginDefinition = {
  requestDidStart() {
    return {
      executionDidStart() {
        return {
          willResolveField(ctx) {
            const returnType = ctx.info.returnType;
            const source: unknown = ctx.source;
            return (err, result) => {
              if (!result && returnType instanceof GraphQLNonNull) {
                const err = getNestedError(source);
                if (err instanceof Error) {
                  throw err;
                }
              }
            };
          },
        };
      },
    };
  },
};
