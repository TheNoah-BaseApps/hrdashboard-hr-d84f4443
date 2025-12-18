export function formatDate(date) {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Format date error:', error);
    return 'Invalid Date';
  }
}

export function formatDateTime(date) {
  if (!date) return 'N/A';
  
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid Date';
    
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Format datetime error:', error);
    return 'Invalid Date';
  }
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '$0.00';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    console.error('Format currency error:', error);
    return '$0.00';
  }
}

export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  
  try {
    return new Intl.NumberFormat('en-US').format(num);
  } catch (error) {
    console.error('Format number error:', error);
    return '0';
  }
}

export function formatPercentage(value, decimals = 1) {
  if (value === null || value === undefined) return '0%';
  
  try {
    return `${Number(value).toFixed(decimals)}%`;
  } catch (error) {
    console.error('Format percentage error:', error);
    return '0%';
  }
}

export function truncateText(text, maxLength = 50) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}