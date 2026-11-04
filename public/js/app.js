const search = document.getElementById('memberSearch');
if (search) {
  search.addEventListener('input', () => {
    const term = search.value.trim().toLocaleLowerCase('es');
    let visible = 0;
    document.querySelectorAll('.member-card').forEach(card => {
      const match = card.dataset.name.includes(term);
      card.classList.toggle('hidden', !match);
      if (match) visible++;
    });
    const noResults = document.getElementById('noResults');
    if (noResults) noResults.classList.toggle('hidden', visible !== 0);
  });
}
