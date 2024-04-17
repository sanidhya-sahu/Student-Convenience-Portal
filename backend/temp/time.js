const lastMonthDate = new Date();
console.log(lastMonthDate.toLocaleString());
// console.log(lastMonthDate.toISOString());
// console.log(lastMonthDate.toString());

lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
const formattedDate = lastMonthDate.toLocaleString().toString();

// Log the result to the console
console.log(formattedDate);