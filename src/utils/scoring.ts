/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { C } from "../constants";

export const scoreColor = (v: number) => v >= 75 ? C.green : v >= 50 ? C.amber : C.red;
