'use strict';

const common = require('../common');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const tmpdir = require('../common/tmpdir');

tmpdir.refresh();

// Place a two-byte UTF-8 sequence across the 512 KiB read boundary. This
// verifies that callback-based readFile() preserves decoder state between its
// bounded reads for encoded regular files.
const boundary = 512 * 1024;
const input = Buffer.alloc(4 * boundary + 1024, 0x61);
input[boundary - 1] = 0xC3;
input[boundary] = 0xA9;
const filename = path.join(tmpdir.path, 'encoded-chunked.txt');
fs.writeFileSync(filename, input);

for (const encoding of [
  'utf8', 'utf16le', 'latin1', 'ascii', 'base64', 'base64url', 'hex',
]) {
  fs.readFile(filename, encoding, common.mustSucceed((output) => {
    assert.strictEqual(output, input.toString(encoding));
  }));
}
