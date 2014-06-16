window.addEventListener('HTMLImportsLoaded', function(e) {

    var app = document.getElementById('app');

    function setWindowSize() {
        var myWidth, myHeight;
        if (typeof (window.innerWidth) == 'number') {
            myWidth = window.innerWidth;
            myHeight = window.innerHeight;
        } else {
            if (document.documentElement
                && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
                myWidth = document.documentElement.clientWidth;
                myHeight = document.documentElement.clientHeight;
            } else {
                if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                    myWidth = document.body.clientWidth;
                    myHeight = document.body.clientHeight;
                }
            }
        }
        if (myHeight) {
            app.style.height = myHeight + 'px';
        }
    }

    window.addEventListener('resize', setWindowSize);

    setWindowSize();

    var slApp = document.createElement('sl-app');
    app.appendChild(slApp);
});
