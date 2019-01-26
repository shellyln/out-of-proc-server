/*
 *
 * Copyright 2019 Shellyl_N.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */


const fs = require('fs');



function getStdin() {
    let fdStdin;
    try {
        // process.stdin is pipe on *nix environment.
        // Error is occured if fs.readSync(0, ...) is called.
        //    "Error: ESPIPE: invalid seek, read"
        fdStdin = fs.openSync('/dev/stdin', 'rs');
    } catch (e) {
        // eslint-disable-next-line no-empty
    }
    return fdStdin;
}
module.exports = getStdin;
