export class TextField {
    constructor({
        elementId,
        property,
        parentElement,
        item,
        withLabel = true,
        additionalClasses = ""
    }) {
        this.elementId = elementId.replace(/^#/, '');
        this.property = property;
        this.parentElement = parentElement;
        this.item = item;
        this.withLabel = withLabel;
        this.additionalClasses = additionalClasses;
        this.displayProperty = this.formatDisplayProperty(property);
        this.render();
    }

    formatDisplayProperty(property) {
        return property
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => this.capitalizeFirstLetter(word))
            .join(' ');
    }

    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        const newFieldHTML = `
        <div class="${this.additionalClasses}">
            ${this.withLabel ? `<span class="property-label">${this.displayProperty}</span>` : ''}
            <span id="${this.elementId}">${this.item[this.property]}</span>
        </div>
        `;

        $(this.parentElement).append(newFieldHTML);
    }
}
