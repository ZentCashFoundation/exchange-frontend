  async function profileUser2() {
    const data = await profile();
    if (!data) return;

    console.log(data[0]);

    const username_account = document.getElementById('username');
    username_account.textContent = data[0].username;

    const email = document.getElementById('email_user');
    email.textContent = data[0].email;

    const first_name = document.getElementById('first_name');
    first_name.textContent = data[0].first_name;

    const lart_name = document.getElementById('last_name');
    lart_name.textContent = data[0].last_name;

    const date_of_birth = document.getElementById('date_of_birth');
    date_of_birth.textContent = new Date(data[0].date_of_birth).toLocaleString();

    const nationality = document.getElementById('nationality');
    nationality.textContent = data[0].nationality;

    const country = document.getElementById('country');
    country.textContent = data[0].country;

    const city = document.getElementById('city');
    city.textContent = data[0].city;

    const postal_code = document.getElementById('postal_code');
    postal_code.textContent = data[0].postal_code;

    const address_line1 = document.getElementById('address_line1');
    address_line1.textContent = data[0].address_line1;

   const document_type = document.getElementById('document_type');
   document_type.textContent = data[0].document_type.replace("_", " ").replace("id", "ID");

   const document_country = document.getElementById('document_country');
   document_country.textContent = data[0].document_country;

   const document_expire = document.getElementById('document_expire');
   document_expire.textContent = new Date(data[0].document_expire).toLocaleString();

   const updated_at = document.getElementById('last_update');
   updated_at.textContent = new Date(data[0].updated_at).toLocaleString();

   const verified_at = document.getElementById('verification_date');
   verified_at.textContent = new Date(data[0].verified_at).toLocaleString();

   const status = document.getElementById('status');
   status.textContent = data[0].status;

} 

profileUser2()