"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = (...args) => __awaiter(this, void 0, void 0, function* () {
        const [urlOrRequest, options] = args;
        let url;
        if (typeof urlOrRequest === 'string') {
            url = urlOrRequest;
        }
        else if (urlOrRequest instanceof Request) {
            url = urlOrRequest.url;
        }
        else if (urlOrRequest instanceof URL) {
            url = urlOrRequest.toString();
        }
        if (url && url.includes('/gambling/play')) {
            console.log('Intercepted Fetch Request to:', url);
        }
        const response = yield originalFetch(...args);
        if (url && url.includes('/gambling/play')) {
            const clone = response.clone();
            clone.json().then(data => {
                console.log('Fetch Response Data:', data);
            }).catch(err => console.error('Error reading fetch response as JSON:', err));
        }
        return response;
    });
}
function interceptXHR() {
    const originalXHR = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, async = true, user, password) {
        if (url.includes('/gambling/play')) {
            this.addEventListener('load', function () {
                console.log('Intercepted XHR Request to:', url);
                console.log('XHR Response Data:', this.responseText);
            });
        }
        // Type assertion for arguments
        originalXHR.apply(this, [method, url, async, user, password]);
    };
}
function startInterception() {
    interceptFetch();
    interceptXHR();
}
startInterception();
