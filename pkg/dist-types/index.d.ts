/**
 * Copyright © 2019 kevinpollet <pollet.kevin@gmail.com>`
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE.md file.
 */
import { BuilderOptions } from "@pika/types";
export declare const beforeJob: ({ manifest, options, out, }: BuilderOptions) => Promise<void>;
export declare const build: ({ options, out, reporter, }: BuilderOptions) => Promise<void>;
export declare const afterJob: ({ out }: BuilderOptions) => Promise<void>;
