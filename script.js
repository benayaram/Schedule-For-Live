document.addEventListener('DOMContentLoaded', function () {
    const scheduleList = document.getElementById('scheduleList');
    const addScheduleBtn = document.getElementById('addScheduleBtn');
    const saveScheduleBtn = document.getElementById('saveScheduleBtn');
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const videoUrlInput = document.getElementById('videoUrl');

    let schedules = JSON.parse(localStorage.getItem('schedules')) || [];
    let editIndex = -1;  // To track which schedule is being edited

    // Function to render the schedule list in the UI
    function renderSchedules() {
        scheduleList.innerHTML = '';
        schedules.forEach((schedule, index) => {
            const scheduleItem = document.createElement('div');
            scheduleItem.className = 'schedule-item';
            scheduleItem.innerHTML = `
                <span>${schedule.start_time} - ${schedule.end_time}: <a href="${schedule.video_url}" target="_blank">${schedule.video_url}</a></span>
                <button onclick="editSchedule(${index})">Edit</button>
                <button onclick="deleteSchedule(${index})">Delete</button>
            `;
            scheduleList.appendChild(scheduleItem);
        });
    }

    // Event listener for adding or updating a schedule
    addScheduleBtn.addEventListener('click', () => {
        const startTime = startTimeInput.value;
        const endTime = endTimeInput.value;
        const videoUrl = videoUrlInput.value;

        if (startTime && endTime && videoUrl) {
            if (editIndex === -1) {
                // Add new schedule
                schedules.push({ start_time: startTime, end_time: endTime, video_url: videoUrl });
            } else {
                // Update existing schedule
                schedules[editIndex] = { start_time: startTime, end_time: endTime, video_url: videoUrl };
                editIndex = -1;  // Reset editIndex after updating
                addScheduleBtn.textContent = 'Add Schedule';  // Change button text back to "Add Schedule"
            }

            renderSchedules();
            startTimeInput.value = '';
            endTimeInput.value = '';
            videoUrlInput.value = '';
        } else {
            alert('Please fill out all fields');
        }
    });

    // Function to edit a schedule
    window.editSchedule = function (index) {
        const schedule = schedules[index];
        startTimeInput.value = schedule.start_time;
        endTimeInput.value = schedule.end_time;
        videoUrlInput.value = schedule.video_url;
        editIndex = index;  // Set the index to be edited
        addScheduleBtn.textContent = 'Update Schedule';  // Change button text to "Update Schedule"
    };

    // Function to delete a schedule from the list
    window.deleteSchedule = function (index) {
        schedules.splice(index, 1);
        renderSchedules();
    };

    // Event listener for saving the schedules to localStorage
    saveScheduleBtn.addEventListener('click', () => {
        localStorage.setItem('schedules', JSON.stringify(schedules));
        alert('Schedule saved successfully!');
    });

    // Render schedules when the page loads
    renderSchedules();
});
