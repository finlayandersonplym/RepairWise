
export function toggleFieldsBasedOnState(element, updateProperty, containerElement) {
    const selector = `${element}`;

    $(selector).on("change", (event) => {
        switch (event.target.value) {
            case "Serviced":
                openServicedFields();
            case "Pending Inspection":
                openPendingFields();
                break;
            case "In Progress":
                OpenInProgressFields();
        }
    });
}

function openServicedFields() {

}