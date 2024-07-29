"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var https_1 = require("https");
var fs_1 = require("fs");
var path_1 = require("path");
var serve_static_1 = require("serve-static");
var app = (0, express_1.default)();
// SSL options
var sslOptions = {
    key: fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../client-key.pem')),
    cert: fs_1.default.readFileSync(path_1.default.resolve(__dirname, '../../client-cert.pem'))
};
var PORT = 443;
var HOST = '10.10.248.174';
// Serve static files from the dist directory
app.use((0, serve_static_1.default)(path_1.default.resolve(__dirname, 'dist')));
// Fallback to index.html for SPA
app.get('*', function (req, res) {
    res.sendFile(path_1.default.resolve(__dirname, 'dist', 'index.html'));
});
https_1.default.createServer(sslOptions, app).listen(PORT, HOST, function () {
    console.log("Server is listening on https://".concat(HOST, ":").concat(PORT));
});
