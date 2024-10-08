const FormatDate = (dateString) => {
    const date = new Date(dateString);
    
    // Options for formatting
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    };
  
    // Format the date using Intl.DateTimeFormat
    return date.toLocaleString('en-US', options).replace(',', '');
  };

  export default FormatDate;