const script = document.createElement('script');
script.src = 'https://raw.githack.com/alcaidio/blackjack/main/dist';
document.head.appendChild(script);

or 

var script = document.createElement('script');
script.src = 'https://cdn.jsdelivr.net/gh/alcaidio/blackjack/dist/index.js';
document.head.appendChild(script);

or 

(function() {
    var script = document.createElement('script');
    script.src = 'http://localhost:8080/index.js';
    document.body.appendChild(script);
})();
