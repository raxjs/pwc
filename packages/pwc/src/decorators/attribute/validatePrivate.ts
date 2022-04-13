import { throwError } from '../../error';

export function validatePrivate(isPrivate: boolean) {
  if (isPrivate) {
    throwError('The reflected property must be a public class field!');
  }
}
