window.onload = function() {
    const splineViewer = document.querySelector('spline-viewer');
    if (splineViewer) {
        const shadowRoot = splineViewer.shadowRoot;
        const logo = shadowRoot.querySelector('#logo');
        if (logo) {
            logo.remove();
            console.log('Spline watermark removed');
        }
    }
};