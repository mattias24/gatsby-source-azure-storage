"use strict";

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var slash = require(`slash`);
var path = require(`path`);
var fs = require(`fs-extra`);
var mime = require(`mime`);
var prettyBytes = require(`pretty-bytes`);

var md5File = require(`bluebird`).promisify(require(`md5-file`));
var crypto = require(`crypto`);

var createId = function createId(path) {
  var slashed = slash(path);
  return `${slashed} absPath of file`;
};

exports.createId = createId;

exports.createFileNode = function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(pathToFile) {
        var pluginOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var slashed, parsedSlashed, slashedFile, stats, internal, contentDigest, _contentDigest;

        return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        slashed = slash(pathToFile);
                        parsedSlashed = path.parse(slashed);
                        slashedFile = (0, _extends3.default)({}, parsedSlashed, {
                            absolutePath: slashed,
                            // Useful for limiting graphql query with certain parent directory
                            relativeDirectory: path.relative(pluginOptions.path || process.cwd(), parsedSlashed.dir)
                        });
                        _context.next = 5;
                        return fs.stat(slashedFile.absolutePath);

                    case 5:
                        stats = _context.sent;
                        internal = void 0;

                        if (!stats.isDirectory()) {
                            _context.next = 12;
                            break;
                        }

                        contentDigest = crypto.createHash(`md5`).update(JSON.stringify({ stats: stats, absolutePath: slashedFile.absolutePath })).digest(`hex`);

                        internal = {
                            contentDigest,
                            type: `Directory`,
                            description: `Directory "${path.relative(process.cwd(), slashed)}"`
                        };
                        _context.next = 16;
                        break;

                    case 12:
                        _context.next = 14;
                        return md5File(slashedFile.absolutePath);

                    case 14:
                        _contentDigest = _context.sent;

                        internal = {
                            contentDigest: _contentDigest,
                            mediaType: mime.lookup(slashedFile.ext),
                            type: `AzureFile`,
                            description: `AzureFile "${path.relative(process.cwd(), slashed)}"`
                        };

                    case 16:
                        return _context.abrupt("return", JSON.parse(JSON.stringify((0, _extends3.default)({
                            // Don't actually make the File id the absolute path as otherwise
                            // people will use the id for that and ids shouldn't be treated as
                            // useful information.
                            id: createId(pathToFile),
                            children: [],
                            parent: `___SOURCE___`,
                            internal,
                            sourceInstanceName: pluginOptions.name || `__PROGRAMATTIC__`,
                            absolutePath: slashedFile.absolutePath,
                            relativePath: slash(path.relative(pluginOptions.path || process.cwd(), slashedFile.absolutePath)),
                            extension: slashedFile.ext.slice(1).toLowerCase(),
                            size: stats.size,
                            prettySize: prettyBytes(stats.size),
                            modifiedTime: stats.mtime,
                            accessTime: stats.atime,
                            changeTime: stats.ctime,
                            birthTime: stats.birthtime
                        }, slashedFile, stats))));

                    case 17:
                    case "end":
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x2) {
        return _ref.apply(this, arguments);
    };
}();

