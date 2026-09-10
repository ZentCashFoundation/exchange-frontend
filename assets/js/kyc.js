function kycPersonalSend() {   
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

    if (documentType === "National ID") {
        documentType = "national_id";
    } else if (documentType === "Passport") {
        documentType = "passport";
    } else if (documentType === "Driving License") {
        documentType = "driving_license";
    }

    kycProfile(
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
        documentExpire
    );

    console.log("First Name:", firstName);
    console.log("Last Name:", lastName);
    console.log("Date of Birth:", dateOfBirth);
    console.log("Nationality:", nationality);
    console.log("Address:", address);
    console.log("Country:", country);
    console.log("City:", city);
    console.log("Postal Code:", postalCode);
    console.log("Document Type:", documentType);
    console.log("Document:", documentFile);
    console.log("Document Country:", documentCountry);
    console.log("Document Expire:", documentExpire);
}