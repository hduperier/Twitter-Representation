const loadTemplates = (parent) => {
    handleColumnsSelector(parent);
    const items = parent.querySelectorAll('[template]');
    items.forEach(item => {
        const template = item.getAttribute('template');
        fetch(template)
        .then((response) => {
            return response.text();
        })
        .then(content => {
            item.innerHTML = content;
            loadTemplates(item);
        })
    });
}

const onWindowLoaded = () => {
    loadTemplates(document);
    if(window.ready === undefined) {
        return;
    }
    window.ready.forEach(cb => {
        cb();
    });
}

window.onload = onWindowLoaded;