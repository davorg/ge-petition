function formatNumberWithCommas(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateFooterWithTimestamps() {
  const now = new Date();
  const lastUpdate = now.toISOString().slice(0, 16).replace('T', ' ');
  const nextUpdate = new Date(now.getTime() + 30 * 60000).toISOString().slice(0, 16).replace('T', ' ');
  document.getElementById('data-update-info').textContent = `Last data update: ${lastUpdate} / Next data update: ${nextUpdate}`;
}

fetch('700143.json')
  .then(response => response.json())
  .then(data => {
    const signaturesByConstituency = data.data.attributes.signatures_by_constituency;
    const signaturesByCountry = data.data.attributes.signatures_by_country;

    const constituencyTableBody = document.getElementById('signatures-by-constituency').getElementsByTagName('tbody')[0];
    let totalSignaturesByConstituency = 0;
    signaturesByConstituency.forEach(item => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const countCell = document.createElement('td');
      nameCell.textContent = item.name;
      countCell.textContent = formatNumberWithCommas(item.signature_count);
      countCell.classList.add('text-end');
      row.appendChild(nameCell);
      row.appendChild(countCell);
      constituencyTableBody.appendChild(row);
      totalSignaturesByConstituency += item.signature_count;
    });
    document.getElementById('total-signatures-by-constituency').textContent = formatNumberWithCommas(totalSignaturesByConstituency);

    const countryTableBody = document.getElementById('signatures-by-country').getElementsByTagName('tbody')[0];
    let totalSignaturesByCountry = 0;
    signaturesByCountry.forEach(item => {
      const row = document.createElement('tr');
      const nameCell = document.createElement('td');
      const countCell = document.createElement('td');
      nameCell.textContent = item.name;
      countCell.textContent = formatNumberWithCommas(item.signature_count);
      countCell.classList.add('text-end');
      row.appendChild(nameCell);
      row.appendChild(countCell);
      countryTableBody.appendChild(row);
      totalSignaturesByCountry += item.signature_count;
    });
    document.getElementById('total-signatures-by-country').textContent = formatNumberWithCommas(totalSignaturesByCountry);

    const ukSignatures = signaturesByCountry.find(item => item.code === 'GB').signature_count;
    const nonUkSignatures = signaturesByCountry.reduce((acc, item) => {
      if (item.code !== 'GB') {
        return acc + item.signature_count;
      }
      return acc;
    }, 0);

    const ukVsNonUkTableBody = document.getElementById('uk-vs-non-uk-signatures').getElementsByTagName('tbody')[0];
    const ukRow = document.createElement('tr');
    const ukNameCell = document.createElement('td');
    const ukCountCell = document.createElement('td');
    ukNameCell.textContent = 'UK';
    ukCountCell.textContent = formatNumberWithCommas(ukSignatures);
    ukCountCell.classList.add('text-end');
    ukRow.appendChild(ukNameCell);
    ukRow.appendChild(ukCountCell);
    ukVsNonUkTableBody.appendChild(ukRow);

    const nonUkRow = document.createElement('tr');
    const nonUkNameCell = document.createElement('td');
    const nonUkCountCell = document.createElement('td');
    nonUkNameCell.textContent = 'Non-UK';
    nonUkCountCell.textContent = formatNumberWithCommas(nonUkSignatures);
    nonUkCountCell.classList.add('text-end');
    nonUkRow.appendChild(nonUkNameCell);
    nonUkRow.appendChild(nonUkCountCell);
    ukVsNonUkTableBody.appendChild(nonUkRow);

    document.getElementById('total-uk-vs-non-uk-signatures').textContent = formatNumberWithCommas(ukSignatures + nonUkSignatures);

    $('#signatures-by-constituency').DataTable();
    $('#signatures-by-country').DataTable();
    $('#uk-vs-non-uk-signatures').DataTable();

    updateFooterWithTimestamps();
  });
