
export class Label {
    constructor({
        elementId,
        parentElement,
        label = "",
        additionalClasses = ""
    }, itemId) {
        this.elementId = elementId.replace(/^#/, '');
        this.parentElement = parentElement;
        this.label = label;
        this.additionalClasses = additionalClasses;
        this.itemId = itemId;
        this.$element = null;
        this.render();
    }

    render() {
        const newLabelHTML = `
            <div class="${this.additionalClasses}">
                    <h3>${this.label}</h3>
            </div>
        `;
        $(this.parentElement).append(newLabelHTML);
        this.$element = $(`#${this.elementId}`);
    }

    getElement() {
        return this.$element;
    }
}
