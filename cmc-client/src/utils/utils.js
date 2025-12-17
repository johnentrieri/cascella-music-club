export function getToday() {
  const today = new Date();
  const year = today.getFullYear();
  let month = today.getMonth() + 1; // Months are 0-indexed, so add 1
  let day = today.getDate();

  if (month < 10) month = '0' + month
  if (day < 10) day = '0' + day

  const formattedDate = `${year}-${month}-${day}`;
  return (formattedDate);
}

export function getWeekEnd() {
  const weekEnd = new Date();
  weekEnd.setDate(weekEnd.getDate() + 6);
  const year = weekEnd.getFullYear();
  let month = weekEnd.getMonth() + 1; // Months are 0-indexed, so add 1
  let day = weekEnd.getDate();

  if (month < 10) month = '0' + month
  if (day < 10) day = '0' + day

  const formattedDate = `${year}-${month}-${day}`;
  return (formattedDate);
}

export function isActiveDiscussion(discussion) {

  const today = new Date();
  const startDate = new Date(discussion.start_date + 'T00:00:00Z');
  const endDate = new Date(discussion.end_date + 'T00:00:00Z');

  return(today >= startDate && today <= endDate);
}