function interceptXHR() {
    const originalXHR = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function (
        method: string,
        url: string,
        async: boolean = true,
        user?: string | null,
        password?: string | null
    ): void {
        if (url.includes('/gambling/play')) {
            this.addEventListener('load', function () {
                console.log('Intercepted XHR Request to:', url);
                console.log('XHR Response Data:', this.responseText);
            });
        }

        originalXHR.apply(this, [method, url, async, user, password]);
    };
}

function start() {
    interceptXHR();
}

start();
