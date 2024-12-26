const FormatCurrency = (value) => {
    // Convert value to a number if it's a string
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
  
    // Return the formatted currency string
    return `${numberValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
  };
  
export default FormatCurrency;
  