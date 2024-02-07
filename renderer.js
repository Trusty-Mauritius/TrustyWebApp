const { ipcRenderer } = require('electron');

// Event listener for 'get-chats-response'
ipcRenderer.on('get-chats-response', (event, groupData) => {
  const csvContent = convertToCSV(groupData);
  downloadCSV(csvContent);
});

// Click event listener for 'Get Chats' button
document.getElementById('getChatsButton').addEventListener('click', () => {
  ipcRenderer.send('get-chats-request');
});

// Function to convert group data to CSV format
function convertToCSV(groupData) {
  let csvRows = ['Group Name,Group ID,Participant Number'];
  for (const groupName in groupData) {
    const group = groupData[groupName];
    group.participants.forEach(participant => {
      const row = `"${groupName}","${group.id}","${participant.number}"`;
      csvRows.push(row);
    });
  }
  return csvRows.join('\n');
}

// Function to trigger download of CSV file
function downloadCSV(csvContent) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'groupChats.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
