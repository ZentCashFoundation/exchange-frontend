async function kycPersonalSend() {
    const firstName = document.getElementById("first_name").value;
    const lastName = document.getElementById("last_name").value;
    const dateOfBirth = document.getElementById("date_of_birth").value;
    const nationality = document.getElementById("nationality").value;
    const address = document.getElementById("address_line1").value;
    const country = document.getElementById("country").value;
    const city = document.getElementById("city").value;
    const postalCode = document.getElementById("postal_code").value;

    let documentType = document.getElementById("document_type").value;

    const documentFile = document.getElementById("document").files[0];

    const documentCountry = document.getElementById("document_country").value;
    const documentExpire = document.getElementById("document_expire").value;


    // Comprobar documento
    if (!documentFile) {
        showToast("Document Mandatory", "error");
        return;
    }


    // Convertir tipo de documento
    if (documentType === "National ID") {
        documentType = "national_id";
    } else if (documentType === "Passport") {
        documentType = "passport";
    } else if (documentType === "Driving License") {
        documentType = "driving_license";
    }


    try {

        const data = await kycProfile(
            firstName,
            lastName,
            dateOfBirth,
            nationality,
            address,
            country,
            city,
            postalCode,
            documentType,
            documentCountry,
            documentExpire,
            documentFile
        );

    } catch (error) {
        showToast("Error registering KYC", "error");
    }
}

if (!token) {
    location.href = "/"
}

setInterval(() => {
    if (!token) {
        location.href = "/"
    }
}, 1000);
