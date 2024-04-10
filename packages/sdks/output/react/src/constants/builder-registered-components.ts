import { componentInfo as columnsComponentInfo } from '../blocks/columns/component-info.js';
import { default as Columns } from '../blocks/columns/index.js';
import { componentInfo as slotComponentInfo } from '../blocks/slot/component-info.js';
import { default as Slot } from '../blocks/slot/index.js';
import { componentInfo as symbolComponentInfo } from '../blocks/symbol/component-info.js';
import { default as Symbol } from '../blocks/symbol/index.js';
import { componentInfo as textComponentInfo } from '../blocks/text/component-info.js';
import { default as Text } from '../blocks/text/index.js';
import type { RegisteredComponent } from '../context/types.js';

/**
 * Returns a list of all registered components.
 * NOTE: This needs to be a function to work around ESM circular dependencies.
 */
export const getDefaultRegisteredComponents: () => RegisteredComponent[] = () => [{
  component: Columns,
  ...columnsComponentInfo
}, {
  component: Slot,
  ...slotComponentInfo
}, {
  component: Symbol,
  ...symbolComponentInfo
}, {
  component: Text,
  ...textComponentInfo
}]