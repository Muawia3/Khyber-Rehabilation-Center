export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(dateString));
};

export const formatCurrency = (amount) => {
  if (amount == null) return 'PKR 0';
  return `PKR ${Number(amount).toLocaleString('en-PK')}`;
};
